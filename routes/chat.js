const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const User = require('../models/user')

// Obtener todos los mensajes
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().lean();
        res.render('chat', { messages, currentUser: req.session.nombre }); // Pasar el nombre de usuario actual a la plantilla
    } catch (error) {
        console.error('Error al buscar los mensajes:', error);
        res.status(500).json({ message: 'Error interno del servidor al buscar los mensajes' });
    }
});

// Crear un nuevo mensaje
router.post('/', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const user = req.user; // Obtener el usuario autenticado desde la sesión
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ message: 'El mensaje es obligatorio' });
            }
            const newMessage = new Message({ user: user.nombre, message }); // Usar el nombre de usuario del usuario autenticado
            await newMessage.save();
            res.redirect('/api/chat');
        } else {
            res.status(401).json({ message: 'Debe estar autenticado para enviar un mensaje' });
        }
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar el mensaje' });
    }
});


module.exports = router;
