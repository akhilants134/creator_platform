import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import logger from "../logger.js";
import { withErrorDetails } from "../utils/errorResponse.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const hashResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const normalizeEmail = (email) =>
  String(email ?? "")
    .trim()
    .toLowerCase();

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error); // Debugging line
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Server error during login",
        },
        error,
      ),
    });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // 1. Validate all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, and password",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user with hashed password
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 5. Remove password from response
    user.password = undefined;

    // 6. Send success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    logger.error("Registration error", { message: error.message });
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Server error during registration",
        },
        error,
      ),
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (will be protected later with auth)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding password field
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error fetching users",
        },
        error,
      ),
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public (will be protected later)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID, excluding password
    const user = await User.findById(id).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error fetching user",
        },
        error,
      ),
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (will add auth later)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = normalizeEmail(email);

    // Save updated user
    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error updating user",
        },
        error,
      ),
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (will add auth later)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own profile",
      });
    }

    // Find and delete user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error deleting user",
        },
        error,
      ),
    });
  }
};

// @desc    Change current user's password
// @route   POST /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error changing password",
        },
        error,
      ),
    });
  }
};

// @desc    Request password reset link
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = hashResetToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    logger.info("Password reset link generated", {
      email: user.email,
      resetUrl,
    });

    return res.status(200).json({
      success: true,
      message: "If that email exists, a password reset link has been sent.",
      ...(process.env.NODE_ENV !== "production"
        ? { devToken: resetToken, resetUrl }
        : {}),
    });
  } catch (error) {
    return res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error requesting password reset",
        },
        error,
      ),
    });
  }
};

// @desc    Validate a password reset token
// @route   GET /api/users/reset/:token
// @access  Public
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashResetToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset token is valid",
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error verifying reset token",
        },
        error,
      ),
    });
  }
};

// @desc    Reset password using token
// @route   POST /api/users/reset/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashedToken = hashResetToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    user.passwordChangedAt = new Date();
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error resetting password",
        },
        error,
      ),
    });
  }
};
