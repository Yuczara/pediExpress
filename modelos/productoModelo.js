const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    producto: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }, 
    ventas: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('producto', productoSchema);