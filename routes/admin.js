const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

// Ruta para la vista de administración de usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'nombre email rol').lean();
        res.render('admin/users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


module.exports = router;