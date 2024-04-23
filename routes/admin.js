const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Asegúrate de importar tu modelo de usuario

// Ruta para la vista de administración de usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'nombre email rol').lean(); // Obtener solo datos principales como un objeto JSON plano
        res.render('admin/users', { users }); // Pasar los datos de los usuarios a la vista
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


module.exports = router;