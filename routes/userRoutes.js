const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

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

// Registro
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol, telefono, bio } = req.body;

        // Validaciones
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ error: 'Email ya registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new User({
            nombre,
            email,
            password: hashedPassword,
            rol: rol || 'alumno',
            telefono,
            bio
        });

        await nuevoUsuario.save();

        const token = jwt.sign({ 
            id: nuevoUsuario._id, 
            rol: nuevoUsuario.rol,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        }, process.env.JWT_SECRET);

        res.json({ 
            token,
            user: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ 
            id: usuario._id, 
            rol: usuario.rol,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.JWT_SECRET);

        res.json({ 
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener perfil de usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const usuario = await User.findById(req.user.id).select('-password');
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Actualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { nombre, bio, telefono, avatar } = req.body;
        const usuario = await User.findByIdAndUpdate(
            req.user.id,
            { nombre, bio, telefono, avatar },
            { new: true }
        ).select('-password');
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;