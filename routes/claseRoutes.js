const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Clase = require('../models/Clase');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/materiales/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB límite
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|avi|mov|wmv|txt|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

// Crear clase (solo docentes)
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'docente') {
            return res.status(403).json({ error: 'Solo los docentes pueden crear clases' });
        }

        const { titulo, descripcion, categoria, nivel, precio, duracion, etiquetas, imagen } = req.body;

        const nuevaClase = new Clase({
            titulo,
            descripcion,
            categoria,
            nivel,
            precio,
            duracion,
            docenteId: req.user.id,
            etiquetas: etiquetas ? etiquetas.split(',') : [],
            imagen,
            materiales: []
        });

        await nuevaClase.save();
        await nuevaClase.populate('docenteId', 'nombre email');

        res.json(nuevaClase);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la clase' });
    }
});

// Obtener todas las clases
router.get('/', async (req, res) => {
    try {
        const { categoria, nivel, docente } = req.query;
        let filtros = { activa: true };

        if (categoria) filtros.categoria = categoria;
        if (nivel) filtros.nivel = nivel;
        if (docente) filtros.docenteId = docente;

        const clases = await Clase.find(filtros)
            .populate('docenteId', 'nombre email avatar')
            .sort({ createdAt: -1 });

        res.json(clases);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las clases' });
    }
});

// Obtener clases del docente actual
router.get('/mis-clases', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'docente') {
            return res.status(403).json({ error: 'Solo los docentes pueden ver sus clases' });
        }

        const clases = await Clase.find({ docenteId: req.user.id })
            .populate('docenteId', 'nombre email')
            .sort({ createdAt: -1 });

        res.json(clases);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las clases' });
    }
});

// Obtener una clase específica
router.get('/:id', async (req, res) => {
    try {
        const clase = await Clase.findById(req.params.id)
            .populate('docenteId', 'nombre email avatar bio')
            .populate('alumnos.alumnoId', 'nombre email');

        if (!clase) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }

        res.json(clase);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la clase' });
    }
});

// Subir material a una clase
router.post('/:id/material', authenticateToken, upload.single('archivo'), async (req, res) => {
    try {
        const clase = await Clase.findById(req.params.id);

        if (!clase) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }

        if (clase.docenteId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Solo el docente de la clase puede subir material' });
        }

        const { nombre, tipo, contenido, orden } = req.body;

        const nuevoMaterial = {
            nombre: nombre || req.file?.originalname,
            tipo: tipo || 'archivo',
            url: req.file ? `/uploads/materiales/${req.file.filename}` : null,
            contenido: contenido || null,
            tamaño: req.file?.size,
            orden: parseInt(orden) || clase.materiales.length
        };

        clase.materiales.push(nuevoMaterial);
        await clase.save();

        res.json({ mensaje: 'Material subido exitosamente', material: nuevoMaterial });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir el material' });
    }
});

// Inscribirse a una clase (para alumnos)
router.post('/:id/inscribirse', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'alumno') {
            return res.status(403).json({ error: 'Solo los alumnos pueden inscribirse a clases' });
        }

        const clase = await Clase.findById(req.params.id);

        if (!clase) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }

        const yaInscrito = clase.alumnos.some(alumno => 
            alumno.alumnoId.toString() === req.user.id
        );

        if (yaInscrito) {
            return res.status(400).json({ error: 'Ya estás inscrito en esta clase' });
        }

        clase.alumnos.push({
            alumnoId: req.user.id,
            fechaInscripcion: new Date(),
            progreso: 0,
            completada: false
        });

        await clase.save();
        res.json({ mensaje: 'Inscripción exitosa' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inscribirse' });
    }
});

// Actualizar progreso de alumno
router.put('/:id/progreso', authenticateToken, async (req, res) => {
    try {
        const { progreso, completada } = req.body;
        const clase = await Clase.findById(req.params.id);

        if (!clase) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }

        const alumno = clase.alumnos.find(a => 
            a.alumnoId.toString() === req.user.id
        );

        if (!alumno) {
            return res.status(404).json({ error: 'No estás inscrito en esta clase' });
        }

        alumno.progreso = progreso;
        if (completada !== undefined) alumno.completada = completada;

        await clase.save();
        res.json({ mensaje: 'Progreso actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar progreso' });
    }
});

module.exports = router;