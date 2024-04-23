const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para la página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para la página de inicio (home)
router.get('/home', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            // Buscar el usuario actual y obtener un objeto JSON simple
            const user = await User.findById(req.user._id).lean();

            // Renderizar la plantilla home y pasar el usuario
            res.render('home', { user });
        } else {
            // Redirigir al usuario a la página de inicio de sesión si no está autenticado
            res.redirect('/login');
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, nombre, apellido, edad, rol } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('El correo electrónico ya está registrado');
        }

        const newUser = new User({ email, password, nombre, apellido, edad, rol });
        await newUser.save();

        res.redirect('/home');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login', 
    failureFlash: true 
}));

router.post('/logout', (req, res) => {
    req.logout(() => {}); // Cerrar sesión del usuario
    res.redirect('/home'); // Redirigir al usuario a la página de inicio
});

router.get('/logout', (req, res) => {
    req.logout(); // Cerrar sesión del usuario
    res.redirect('/home'); // Redirigir al usuario a la página de inicio
});

module.exports = router;