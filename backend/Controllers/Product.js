const mongoose = require("mongoose");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

// Create a new product

exports.createProduct = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;

    if (req.body.price) {
      // Convert price to string and validate decimal format
      const priceStr = req.body.price.toString();

      // Allow very small decimal numbers
      if (!/^\d*\.?\d+$/.test(priceStr) || parseFloat(priceStr) < 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          msg: "Price must be a valid positive number",
        });
      }

      // Convert to Decimal128 with full precision
      req.body.price = mongoose.Types.Decimal128.fromString(priceStr);
    }

    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      product: {
        ...product._doc,
        price: product.price.toString(), // Convert Decimal128 to string
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Something went wrong while creating product",
    });
  }
};
// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    const formattedProducts = products.map((p) => ({
      ...p._doc,
      price: p.price.toString(), // Convert each price to string
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      products: formattedProducts,
      count: products.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Something went wrong while fetching products",
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
        msg: `No product found with id: ${productId}`,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Something went wrong while fetching product",
    });
  }
};

//get product count
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    // console.error("Error fetching product count:", err);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
};



// Get Total Sales for All Products
exports.getTotalSales = async (req, res) => {

  // console.  // console.log("Calculating total sales...");

  try {
    const products = await Product.find({});

    let totalSales = 0;

    products.forEach((product) => {
      const price = parseFloat(product.price.toString());
      const quantity = product.quantity || 0;

      totalSales += price * quantity;
    });

    res.status(200).json({
      success: true,
      totalSales: totalSales.toFixed(2), // return as string with 2 decimal points
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message || "Failed to calculate total sales",
      
    });
    // console.error("Error calculating total sales:", error);

  }
};

