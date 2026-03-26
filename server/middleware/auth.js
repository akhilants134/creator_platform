import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      const error = new Error('Not authorized, no token');
      error.statusCode = 401;
      return next(error);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    // Continue to next middleware/route
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error.statusCode = 401;
      error.message = 'Not authorized, token failed';
    }
    next(error);
  }
};