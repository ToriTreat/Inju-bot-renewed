const mongoose = require('mongoose');
const logger = require('../utils/logger');

mongoose.set('bufferCommands', false);

async function connectDB(uri) {
  // FIX: Skip connection entirely if no URI is provided.
  // Previously an empty MONGO_URI caused a connection attempt that would
  // fail, and then session cleanup would spam errors every 5 minutes.
  if (!uri) {
    logger.warn('MONGO_URI not set — running in limited mode (tickets/verification disabled)');
    return;
  }
  try {
    await mongoose.connect(uri, { dbName: 'baddies' });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection failed: ' + err.message);
    logger.warn('MongoDB unavailable — running in limited mode');
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB error: ' + err.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
}

module.exports = { connectDB };
