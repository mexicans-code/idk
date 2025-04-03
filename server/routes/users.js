
// routes/users.js
const express = require('express');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { validateRegistration, validateLogin, validateUserUpdate, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Función para sanitizar consultas MongoDB
const sanitizeMongoQuery = (query) => {
  if (query && typeof query === 'object') {
    Object.keys(query).forEach(key => {
      if (key === '_id' && typeof query[key] === 'string' && ObjectId.isValid(query[key])) {
        query[key] = new ObjectId(query[key]);
      }
      
      if (typeof query[key] === 'object' && query[key] !== null) {
        sanitizeMongoQuery(query[key]);
      }
      
      if (key.startsWith('$') && !['$set', '$unset', '$push', '$pull'].includes(key)) {
        delete query[key];
      }
    });
  }
  return query;
};

module.exports = (db) => {
  // Registro de usuario
  router.post('/register', validateRegistration, async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = db.collection('users');
    
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, password: hashedPassword });
    
    res.json({ message: 'Usuario registrado con éxito' });
  });
  
  // Login
  router.post('/login', validateLogin, async (req, res) => {
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
    
    res.json({ 
      message: 'Login exitoso', 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  });
  
  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      const usersCollection = db.collection('users');
      const users = await usersCollection.find({}).toArray();
      
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
  
  // Obtener usuario por ID
  router.get('/:id', validateObjectId, async (req, res) => {
    try {
      const { id } = req.params;
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const { password, ...userWithoutPassword } = user;
      userWithoutPassword._id = userWithoutPassword._id.toString();
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Actualizar usuario
  router.put('/:id', validateUserUpdate, async (req, res) => {
    try {
      const { id } = req.params;
      const { email, password } = req.body;
      const usersCollection = db.collection('users');
      
      const updateData = {};
      if (email) updateData.email = email;
      
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
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Eliminar usuario
  router.delete('/:id', validateObjectId, async (req, res) => {
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
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  return router;
};