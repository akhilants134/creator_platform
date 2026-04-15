const LOCAL_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

export const getAllowedOrigins = () => {
  if (process.env.NODE_ENV !== "production") {
    return LOCAL_ORIGINS;
  }

  return process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];
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
