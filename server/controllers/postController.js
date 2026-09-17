import Post from "../models/Post.js";
import { withErrorDetails } from "../utils/errorResponse.js";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = (io) => async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user?.id || req.user?._id;

    const createdPost = await Post.create({
      title,
      content,
      category,
      author,
      image: req.file ? req.file.path : undefined,
    });

    if (io) {
      io.emit("newPost", {
        message: `New post created by ${req.user.name}`,
        post: {
          _id: createdPost._id,
          id: createdPost.id,
          title: createdPost.title,
          createdBy: req.user.name,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: createdPost,
    });
  } catch (error) {
    res.status(400).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error creating post",
        },
        error
      ),
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error fetching posts",
        },
        error
      ),
    });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error fetching post",
        },
        error
      ),
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const currentUserId = req.user?.id || req.user?._id;
    const authorId = post.author?.id || post.author?._id || post.authorId || post.author;

    // Check if the user is the author
    if (authorId?.toString() !== currentUserId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts",
      });
    }

    const { title, content, category } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (category) updates.category = category;
    if (req.file) updates.image = req.file.path;

    const updatedPost = await Post.update(req.params.id, updates);
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error updating post",
        },
        error
      ),
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const currentUserId = req.user?.id || req.user?._id;
    const authorId = post.author?.id || post.author?._id || post.authorId || post.author;

    // Check if the user is the author
    if (authorId?.toString() !== currentUserId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    await Post.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ...withErrorDetails(
        {
          success: false,
          message: "Error deleting post",
        },
        error
      ),
    });
  }
};
