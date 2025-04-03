const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

require('dotenv').config();


// Middleware to authenticate users
exports.authenticateUser = async (req, res, next) => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: 'No Token Provided',
      });
    }

    const token = authHeader.split(" ")[1].trim();

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg: 'Internal Server Error',
      });
    }

    console.log(process.env.JWT_SECRET);

    // Decode token without verification (for debugging purposes)
    const decoded = jwt.decode(token, { complete: true });

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    

    // Attach user information to the request object
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };

    console.log("🔹 User added to req:", req.user);

    // Proceed to the next middleware
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: "Token invalid or expired",
    });
  }
};


// Middleware to check if user is admin
exports.authorizeAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: 'Not authorized to access this route'
    });
  }
  
  
  next();
};
