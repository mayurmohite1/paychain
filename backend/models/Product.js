const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  image: {
    type: String,
    required: [true, "Please provide product image"],
  },
  manufacturingYear: {
    type: Date,
    required: [true, "Please provide manufacturing year"],
  },
  price: {
    type: mongoose.Types.Decimal128, // Supports high-precision decimal
    required: [true, "Please provide product price"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quantity:{
    type:Number,
    required:true
  }
});

module.exports = mongoose.model("Product", ProductSchema);
