
const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const Pago = require('../models/Pago');
const Clase = require('../models/Clase');
const jwt = require('jsonwebtoken');

// Configurar MercadoPago
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

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

// Crear preferencia de pago
router.post('/crear-preferencia', authenticateToken, async (req, res) => {
    try {
        const { claseId } = req.body;
        
        if (req.user.rol !== 'alumno') {
            return res.status(403).json({ error: 'Solo los alumnos pueden realizar pagos' });
        }

        const clase = await Clase.findById(claseId).populate('docenteId', 'nombre');
        
        if (!clase) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }

        // Verificar si ya está inscrito
        const yaInscrito = clase.alumnos.some(alumno => 
            alumno.alumnoId.toString() === req.user.id
        );

        if (yaInscrito) {
            return res.status(400).json({ error: 'Ya estás inscrito en esta clase' });
        }

        // Crear registro de pago pendiente
        const nuevoPago = new Pago({
            alumnoId: req.user.id,
            claseId: claseId,
            monto: clase.precio,
            estado: 'pendiente'
        });

        await nuevoPago.save();

        // Crear preferencia en MercadoPago
        const preference = {
            items: [
                {
                    title: clase.titulo,
                    unit_price: clase.precio,
                    quantity: 1,
                    currency_id: 'ARS',
                    description: `Clase: ${clase.titulo} - Docente: ${clase.docenteId.nombre}`
                }
            ],
            payer: {
                name: req.user.nombre,
                email: req.user.email
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/pago-exitoso`,
                failure: `${process.env.FRONTEND_URL}/pago-fallido`,
                pending: `${process.env.FRONTEND_URL}/pago-pendiente`
            },
            auto_return: "approved",
            external_reference: nuevoPago._id.toString(),
            notification_url: `${process.env.BACKEND_URL}/api/pagos/webhook`,
            statement_descriptor: "EDUCACION ONLINE"
        };

        const response = await mercadopago.preferences.create(preference);
        
        // Guardar ID de preferencia
        nuevoPago.preferenciaId = response.body.id;
        await nuevoPago.save();

        res.json({
            preference_id: response.body.id,
            init_point: response.body.init_point,
            sandbox_init_point: response.body.sandbox_init_point,
            pago_id: nuevoPago._id
        });

    } catch (error) {
        console.error('Error creando preferencia:', error);
        res.status(500).json({ error: 'Error al crear la preferencia de pago' });
    }
});

// Webhook para notificaciones de MercadoPago
router.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const payment = await mercadopago.payment.findById(data.id);
            const externalReference = payment.body.external_reference;
            
            if (externalReference) {
                const pago = await Pago.findById(externalReference);
                
                if (pago) {
                    // Actualizar estado del pago
                    pago.mercadoPagoId = payment.body.id;
                    pago.metodoPago = payment.body.payment_method_id;
                    pago.detalles = {
                        merchant_order_id: payment.body.order?.id,
                        payment_id: payment.body.id,
                        payment_type: payment.body.payment_type_id,
                        status: payment.body.status,
                        status_detail: payment.body.status_detail
                    };

                    if (payment.body.status === 'approved') {
                        pago.estado = 'aprobado';
                        pago.fechaPago = new Date();
                        
                        // Inscribir al alumno en la clase
                        const clase = await Clase.findById(pago.claseId);
                        if (clase) {
                            clase.alumnos.push({
                                alumnoId: pago.alumnoId,
                                fechaInscripcion: new Date(),
                                progreso: 0,
                                completada: false
                            });
                            await clase.save();
                        }
                    } else if (payment.body.status === 'rejected') {
                        pago.estado = 'rechazado';
                    }

                    await pago.save();
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).send('Error');
    }
});

// Verificar estado de pago
router.get('/estado/:pagoId', authenticateToken, async (req, res) => {
    try {
        const pago = await Pago.findById(req.params.pagoId)
            .populate('claseId', 'titulo')
            .populate('alumnoId', 'nombre email');

        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        // Verificar que el usuario tenga permisos
        if (pago.alumnoId._id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permisos para ver este pago' });
        }

        res.json(pago);
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar el estado del pago' });
    }
});

// Obtener historial de pagos del usuario
router.get('/historial', authenticateToken, async (req, res) => {
    try {
        const pagos = await Pago.find({ alumnoId: req.user.id })
            .populate('claseId', 'titulo descripcion imagen')
            .sort({ createdAt: -1 });

        res.json(pagos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de pagos' });
    }
});

module.exports = router;
