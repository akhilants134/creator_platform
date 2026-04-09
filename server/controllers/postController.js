import Post from "../models/Post.js";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = (io) => async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user._id;

    const post = new Post({
      title,
      content,
      category,
      author,
      image: req.file ? req.file.path : undefined, // Cloudinary provides the path (URL)
    });

    const createdPost = await post.save();

    if (io) {
      io.emit("newPost", {
        message: `New post created by ${req.user.name}`,
        post: {
          _id: createdPost._id,
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
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email",
    );
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
      success: false,
      message: "Error fetching post",
      error: error.message,
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

    // Check if the user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts",
      });
    }

    const { title, content, category } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    if (req.file) {
      post.image = req.file.path;
    }

    const updatedPost = await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating post",
      error: error.message,
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

    // Check if the user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};
