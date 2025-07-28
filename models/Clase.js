const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, enum: ['video', 'pdf', 'imagen', 'texto'], required: true },
    url: String,
    contenido: String,
    tamaño: Number,
    orden: { type: Number, default: 0 }
});

const claseSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    categoria: String,
    nivel: { type: String, enum: ['principiante', 'intermedio', 'avanzado'], default: 'principiante' },
    precio: { type: Number, required: true, min: 0 },
    duracion: Number, // en minutos
    fecha: Date,
    docenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    materiales: [materialSchema],
    imagen: String,
    etiquetas: [String],
    activa: { type: Boolean, default: true },
    alumnos: [{ 
        alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        fechaInscripcion: { type: Date, default: Date.now },
        progreso: { type: Number, default: 0 },
        completada: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Clase', claseSchema);