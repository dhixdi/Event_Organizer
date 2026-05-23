const mongoose = require('mongoose');

async function connectMongo() {
  const mongoMode = (process.env.MONGO_MODE || 'full').toLowerCase();

  if (mongoMode === 'sql-only') {
    console.warn('MongoDB skipped because MONGO_MODE=sql-only');
    return null;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required when MONGO_MODE=full');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    return mongoose.connection;
  } catch (error) {
    if (mongoMode === 'full') {
      throw error;
    }

    console.warn(`MongoDB connection skipped: ${error.message}`);
    return null;
  }
}

module.exports = { connectMongo };