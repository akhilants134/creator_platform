import express from 'express';
import authenticate from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'creator-platform' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    // 1. Check if a file was actually sent
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // 2. Upload the buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // 3. Return the secure_url
    return res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
});

// Multer error handler (must have 4 parameters to be treated as error middleware)
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.'
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || 'File upload error'
  });
});

export default router;
