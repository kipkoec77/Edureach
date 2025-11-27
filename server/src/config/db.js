const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('\nERROR: `MONGO_URI` is not set in environment.');
      console.error('Copy `server/.env.example` to `server/.env` and set `MONGO_URI` to your MongoDB connection string.\n');
      process.exit(1);
    }

    // Mongoose v7+ doesn't need useNewUrlParser/useUnifiedTopology options
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
