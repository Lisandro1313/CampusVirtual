// models/Clase.js
const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  docente: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Clase", claseSchema);
