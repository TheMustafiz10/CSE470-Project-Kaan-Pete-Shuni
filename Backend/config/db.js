
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Environment variables check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PORT:', process.env.PORT);
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    

    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.error('Please check your .env file');
      process.exit(1);
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('🔗 Connection string preview:', process.env.MONGODB_URI.substring(0, 20) + '...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    

    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running on your system');
      console.error('   - If using local MongoDB, start it with: mongod');
      console.error('   - If using MongoDB Atlas, check your connection string');
    }
    
    process.exit(1);
  }
};

export default connectDB;