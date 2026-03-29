const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" ? { error: err.stack } : {}),
  });
};

export default errorHandler;
