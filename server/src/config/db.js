import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

  if (!uri.startsWith('mongodb')) {
    throw new Error(
      'MONGODB_URI environment variable is not properly set. ' +
      'Please configure your MongoDB Atlas connection string in Vercel environment variables. ' +
      'Expected format: mongodb+srv://user:password@cluster.mongodb.net/database'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((mongoose) => {
        console.log('✓ MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('✗ MongoDB connection failed:', err.message);
        throw new Error(`Failed to connect to MongoDB: ${err.message}`);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
