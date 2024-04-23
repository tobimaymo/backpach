const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const { DateTime } = require('luxon'); 

// Ruta para obtener todos los usuarios con datos principales
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'nombre email rol'); 
        console.log(users)
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para limpiar usuarios inactivos
router.delete('/', async (req, res) => {
    try {
        // Calcular la fecha hace dos días
        const twoDaysAgo = DateTime.now().minus({ days: 2 }).toJSDate();

        // Eliminar usuarios que no hayan iniciado sesión en los últimos dos días
        const result = await User.deleteMany({ lastLogin: { $lt: twoDaysAgo } });


        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;