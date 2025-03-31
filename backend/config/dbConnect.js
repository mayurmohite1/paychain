const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://mayur010803:mayur@cluster0.rawdgjy.mongodb.net/cryptoApp",
      {}
    );
    console.log("MongoDB connected:");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
