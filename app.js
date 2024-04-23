const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exphbs  = require('express-handlebars');
const adminRouter = require('./routes/admin');
const indexRouter = require('./routes/index');
const User = require('./models/user');
const passportConfig = require('./config/passport');
const usersRouter = require('./routes/users');



const app = express();

// Configuración de dotenv para cargar variables de entorno
dotenv.config();

// Configuración de la conexión a la base de datos
mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configuración de Express
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/admin', adminRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
