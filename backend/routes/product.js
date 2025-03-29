const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  getProductCount
} = require("../Controllers/Product");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth");
const Product = require('../models/Product');


// Get all products - accessible to all
router.get("/", getAllProducts);


router.get("/count", getProductCount);


// Get a specific product - accessible to all
router.get("/:id", getProduct);

// Create a product - only for admins
router.post("/", authenticateUser, authorizeAdmin, createProduct);
// GET /api/products/count




module.exports = router;
