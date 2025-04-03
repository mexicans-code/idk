// index.js (archivo principal)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

let db;
async function initializeDB() {
  db = await connectDB(process.env.MONGO_URI);
  
  const usersRoutes = require('./routes/users')(db);
  
  app.use('/users', usersRoutes);
  app.post('/register', usersRoutes);
  app.post('/login', usersRoutes);
  
  app.use(errorHandler);
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa no manejada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

// Iniciar aplicación
initializeDB().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});