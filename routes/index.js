const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
            const user = await User.findById(req.user._id).lean();
            res.render('home', { user });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
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
    req.logout(() => {});
    res.redirect('/home'); 
});

router.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/home'); 
});

// Ruta para la página de olvidé mi contraseña
router.get('/forgot', (req, res) => {
    res.render('forgot');
});

// Manejar la solicitud del formulario de olvidé mi contraseña
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No se encontró ningún usuario con este correo electrónico' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
        const transporter = nodemailer.createTransport({
        });
        const mailOptions = {
            to: email,
            subject: 'Restablecer contraseña',
            text: `Parece que olvidaste tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n
                http://${req.headers.host}/reset/${token}\n\n
                Si no solicitaste esto, ignora este correo y tu contraseña seguirá siendo la misma.`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña' });
    } catch (error) {
        console.error('Error al procesar la solicitud de olvidé mi contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la solicitud de olvidé mi contraseña' });
    }
});

module.exports = router;