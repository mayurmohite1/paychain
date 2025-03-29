const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // Add the user ID to the product data
    req.body.createdBy = req.user.userId;
    
    // Create the product
    const product = await Product.create(req.body);
    
    res.status(StatusCodes.CREATED).json({ 
      success: true, 
      product 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || 'Something went wrong while creating product'
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.status(StatusCodes.OK).json({ 
      success: true,
      products, 
      count: products.length 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || 'Something went wrong while fetching products'
    });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `No product found with id: ${productId}`
      });
    }
    
    res.status(StatusCodes.OK).json({ 
      success: true, 
      product 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || 'Something went wrong while fetching product'
    });
  }
};


//get product count
exports.getProductCount =async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching product count:", err);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
}






