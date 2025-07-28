const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Crear directorio para uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
const materialesDir = path.join(uploadsDir, 'materiales');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(materialesDir)) {
    fs.mkdirSync(materialesDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_virtual');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Rutas
const userRoutes = require('./routes/userRoutes');
const claseRoutes = require('./routes/claseRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

app.use('/api/users', userRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/pagos', pagoRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});