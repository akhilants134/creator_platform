import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, status } = req.body;

    // Validate required fields
    if (!title || !content) {
      const error = new Error('Please provide title and content');
      error.statusCode = 400;
      throw error;
    }

    // Create post with authenticated user as author
    const post = await Post.create({
      title,
      content,
      category,
      status,
      author: req.user._id // From protect middleware
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    // Get page and limit from query params (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get posts for logged-in user only
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email'); // Include author info

    // Get total count for pagination
    const total = await Post.countDocuments({ author: req.user._id });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this post');
      error.statusCode = 403;
      throw error;
    }

    const { title, content, category, status } = req.body;
    
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this post');
      error.statusCode = 403;
      throw error;
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (post.author._id.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view this post');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (error) {
    next(error);
  }
};