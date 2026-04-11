import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/cloudinaryConfig.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const postRoutes = (io) => {
  const router = express.Router();

  // Public routes
  router.get("/", getPosts);
  router.get("/:id", getPostById);

  // Protected routes
  router.post("/", protect, upload.single("image"), createPost(io));
  router.put("/:id", protect, upload.single("image"), updatePost);
  router.delete("/:id", protect, deletePost);

  return router;
};

export default postRoutes;
