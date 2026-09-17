import express from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.js";
import {
  changePasswordRules,
  forgotPasswordRules,
  resetPasswordRules,
  validate,
} from "../middleware/validators.js";
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  verifyResetToken,
} from "../controllers/userController.js";

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reset requests. Try again later.",
  },
});

// User routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordRules,
  validate,
  forgotPassword,
);
router.get("/reset/:token", verifyResetToken);
router.post("/reset/:token", resetPasswordRules, validate, resetPassword);
router.post(
  "/change-password",
  protect,
  changePasswordRules,
  validate,
  changePassword,
);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
