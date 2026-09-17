import express from 'express';

const router = express.Router();

/**
 * @desc    Intentionally throws an error to test global error handling
 * @route   GET /api/debug/error
 * @access  Public
 */
router.get('/error', (req, res, next) => {
  const error = new Error('This is an intentional error for testing purposes');
  error.statusCode = 418; // I'm a teapot (just to be unique)
  next(error);
});

/**
 * @desc    Intentionally triggers a Mongoose CastError
 * @route   GET /api/debug/cast-error
 * @access  Public
 */
router.get('/cast-error', (req, res, next) => {
  const error = new Error('Resource not found');
  error.name = 'CastError';
  error.value = 'invalid_id_123';
  next(error);
});

export default router;
