const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: String,
    email: { type: String, unique: true },
    password: String,
    rol: { type: String, enum: ['alumno', 'docente'], default: 'alumno' },
});

module.exports = mongoose.model('User', userSchema);
