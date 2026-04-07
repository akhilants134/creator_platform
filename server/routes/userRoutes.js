import express from "express";
import { protect } from "../middleware/auth.js";
import { changePasswordRules, validate } from "../middleware/validators.js";
import {
  changePassword,
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// User routes
router.post("/login", loginUser);
router.post("/register", registerUser);
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
