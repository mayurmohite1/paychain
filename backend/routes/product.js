const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
} = require("../Controllers/Product");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth");

// Get all products - accessible to all
router.get("/", getAllProducts);

// Get a specific product - accessible to all
router.get("/:id", getProduct);

// Create a product - only for admins
router.post("/", authenticateUser, authorizeAdmin, createProduct);

module.exports = router;
