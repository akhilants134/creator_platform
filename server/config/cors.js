const LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const normalizeUrl = (url) => (url ? url.trim().replace(/\/$/, "") : "");

export const getAllowedOrigins = () => {
  const customOrigins = [];

  const addOrigins = (val) => {
    if (!val) return;
    val
      .split(",")
      .map(normalizeUrl)
      .filter(Boolean)
      .forEach((o) => {
        if (!customOrigins.includes(o)) customOrigins.push(o);
      });
  };

  addOrigins(process.env.CLIENT_URL);
  addOrigins(process.env.FRONTEND_URL);
  addOrigins(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return [...new Set([...LOCAL_ORIGINS, ...customOrigins])];
};

export const originValidator = (origin, callback) => {
  // Allow same-origin/non-browser requests (curl, health probes, server-to-server).
  if (!origin) {
    return callback(null, true);
  }

  const cleanOrigin = normalizeUrl(origin);
  const allowedOrigins = getAllowedOrigins();

  // Explicit match
  if (allowedOrigins.includes(cleanOrigin)) {
    return callback(null, true);
  }

  // Allow all Vercel preview & production deployments and Render internal/custom domains
  if (
    cleanOrigin.endsWith(".vercel.app") ||
    cleanOrigin.endsWith(".onrender.com")
  ) {
    return callback(null, true);
  }

  // In non-production, allow localhost on any port
  if (
    process.env.NODE_ENV !== "production" &&
    (cleanOrigin.startsWith("http://localhost:") ||
      cleanOrigin.startsWith("http://127.0.0.1:"))
  ) {
    return callback(null, true);
  }

  return callback(new Error("CORS origin not allowed"));
};

export default {
  getAllowedOrigins,
  originValidator,
};
