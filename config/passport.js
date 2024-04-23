// En el archivo config/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email', // Campo utilizado para el nombre de usuario en el formulario de inicio de sesión
    passwordField: 'password' // Campo utilizado para la contraseña en el formulario de inicio de sesión
}, async (email, password, done) => {
    try {
        // Buscar al usuario por su correo electrónico
        const user = await User.findOne({ email: email });

        // Si no se encuentra el usuario, devolver un mensaje de error
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await user.comparePassword(password);

        // Si la contraseña no coincide, devolver un mensaje de error
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Si el usuario y la contraseña son válidos, devolver el usuario
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err);
        });
});
