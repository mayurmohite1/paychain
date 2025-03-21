const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

// Middleware to authenticate users
exports.authenticateUser = async (req, res, next) => {
  // Check for token in headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: 'Authentication invalid'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role
    };
    
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: 'Authentication invalid'
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
