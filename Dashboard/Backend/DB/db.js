const mongoose = require('mongoose');
require('dotenv').config()

console.log(process.env.MONGO_URI)

const connectDB = async () => { //makes an async call to the DB using the Mongo_URI -> gives notice when connected or error occurs
  try {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;