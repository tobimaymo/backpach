const mongoose = require('mongoose');

// Configuración de la conexión a la base de datos
mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('Conexión establecida a MongoDB');
});

// Manejo de eventos de error
mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err.message);
});

// Manejo de eventos de desconexión
mongoose.connection.on('disconnected', () => {
    console.log('Desconectado de MongoDB');
});

// Exportar la conexión para poder usarla en otros archivos si es necesario
module.exports = mongoose.connection;