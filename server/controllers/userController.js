import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, firstName: rFirstName, lastName: rLastName, email, password } = req.body;

    // 1. Validate all required fields are provided
    if ((!name && !rFirstName) || !email || !password) {
      const error = new Error('Please provide all required fields');
      error.statusCode = 400;
      throw error;
    }

    // Determine firstName and lastName
    let firstName = rFirstName;
    let lastName = rLastName;

    if (!firstName && name) {
      const nameParts = name.trim().split(' ');
      firstName = nameParts[0];
      lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';
    }


    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // 3. Create new user (hashing is handled by User model's pre-save hook)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });


    // 5. Remove password from response
    user.password = undefined;

    // 6. Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });


  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (will be protected later with auth)
export const getAllUsers = async (req, res, next) => {
  try {
    // Fetch all users, excluding password field
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public (will be protected later)
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find user by ID, excluding password
    const user = await User.findById(id).select('-password');

    // Check if user exists
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (will add auth later)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, firstName: rFirstName, lastName: rLastName, email } = req.body;

    // Find user
    const user = await User.findById(id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Update fields if provided

    if (rFirstName) user.firstName = rFirstName;
    if (rLastName) user.lastName = rLastName;
    
    if (!rFirstName && name) {
      const nameParts = name.trim().split(' ');
      user.firstName = nameParts[0];
      user.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';
    }
    if (email) user.email = email;



    // Save updated user
    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (will add auth later)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};