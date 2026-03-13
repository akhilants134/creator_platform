import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Public route - no protection
router.post('/register', registerUser);

// Protected routes - require authentication
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;