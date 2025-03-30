const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming you have a User model

// Get total user count
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments(); // Get the number of users
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
