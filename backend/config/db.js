const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const customUri = process.env.MONGO_URI;

  if (customUri) {
    try {
      const conn = await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected to external MongoDB at ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Failed to connect to MONGO_URI (${err.message}). Trying fallback...`);
    }
  }

  // Try standard local MongoDB default port first
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/smarthire', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to local MongoDB at 127.0.0.1:27017/smarthire`);
    return conn;
  } catch (localErr) {
    console.log(`[Database] Local MongoDB not running. Initializing embedded MongoMemoryServer...`);
  }

  // Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'smarthire',
      },
    });
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Embedded in-memory MongoDB started successfully at ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error('[Database] Failed to start MongoMemoryServer:', memErr.message);
    throw memErr;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };

