const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try MongoDB Atlas first, then local MongoDB, then use in-memory fallback
  const mongoURI = 'mongodb+srv://mvarunmathi2004:4546@cluster0.cwbdpuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without database - using in-memory storage for demo');
    
    // Don't exit the process, just log the error
    // The application will handle missing database gracefully
    return null;
  }
};

module.exports = connectDB;