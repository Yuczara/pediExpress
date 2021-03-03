const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('usuario', UsuarioSchema);