// config/db.js
const { MongoClient } = require('mongodb');

const connectDB = async (uri) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    return client.db('tweets');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;