const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ error: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
        nombre,
        email,
        password: hashedPassword,
        rol
    });

    await nuevoUsuario.save();

    const token = jwt.sign({ id: nuevoUsuario._id, rol }, process.env.JWT_SECRET);
    res.json({ token });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = router;
