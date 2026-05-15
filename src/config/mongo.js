const mongoose = require('mongoose');

async function connectMongo() {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set, skipping MongoDB connection');
    return null;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    return mongoose.connection;
  } catch (error) {
    console.warn(`MongoDB connection skipped: ${error.message}`);
    return null;
  }
}

module.exports = { connectMongo };