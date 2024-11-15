//*This function creates a database connection. It is exported and called within server.js

const mongoose = require('mongoose')

// Set the strictQuery option
mongoose.set('strictQuery', true); // or false, depending on your preference

const connectDB = async () => {
  try {
    // Store the connection object in 'conn'
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log the MongoDB host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB
