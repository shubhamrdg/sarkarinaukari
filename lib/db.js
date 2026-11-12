import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your environment variables.");
  }
  if (!/^mongodb(?:\+srv)?:\/\//.test(MONGODB_URI)) {
    throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 60000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error });
  }
}
