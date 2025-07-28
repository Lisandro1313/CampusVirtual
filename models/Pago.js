
const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    claseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
    monto: { type: Number, required: true },
    moneda: { type: String, default: 'ARS' },
    estado: { 
        type: String, 
        enum: ['pendiente', 'aprobado', 'rechazado', 'cancelado'], 
        default: 'pendiente' 
    },
    mercadoPagoId: String,
    preferenciaId: String,
    metodoPago: String,
    fechaPago: Date,
    detalles: {
        merchant_order_id: String,
        payment_id: String,
        payment_type: String,
        status: String,
        status_detail: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pago', pagoSchema);
