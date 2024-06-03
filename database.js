const { MongoClient } = require('mongodb');

async function connectToDatabase() {
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports = { connectToDatabase };