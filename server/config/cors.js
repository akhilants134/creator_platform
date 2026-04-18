const LOCAL_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

export const getAllowedOrigins = () => {
  if (process.env.NODE_ENV !== "production") {
    return LOCAL_ORIGINS;
  }
  // Use FRONTEND_URL for production
  return process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
};

export const originValidator = (origin, callback) => {
  const allowedOrigins = getAllowedOrigins();

  // Allow same-origin/non-browser requests (curl, health probes, server-to-server).
  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("CORS origin not allowed"));
};
