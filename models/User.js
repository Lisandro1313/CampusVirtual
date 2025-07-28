const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['alumno', 'docente'], default: 'alumno' },
    avatar: String,
    bio: String,
    telefono: String,
    fechaRegistro: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);