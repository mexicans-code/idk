require('dotenv').config(); 
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let db;

// Conectar a la base de datos
async function connectDB() {
  try {
    await client.connect();
    db = client.db('tweets');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
}
connectDB();

// **Registro de usuario**
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const usersCollection = db.collection('users');
  const userExists = await usersCollection.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ email, password: hashedPassword });

  res.json({ message: 'Usuario registrado con éxito' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  
    res.json({ message: 'Login exitoso', user });
  });

  // Importar ObjectId correctamente al principio del archivo

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    // Enviar solo la información necesaria, sin passwords
    const safeUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email
    }));
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usersCollection = db.collection('users');
    
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Obtener un usuario específico
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Enviar usuario sin password
    const { password, ...userWithoutPassword } = user;
    userWithoutPassword._id = userWithoutPassword._id.toString();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar un usuario
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const usersCollection = db.collection('users');
    
    const updateData = {};
    if (email) updateData.email = email;
    
    // Si se proporciona un nuevo password, hashearlo
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});
  

// **Iniciar el servidor**
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
