import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import { originValidator } from "./config/cors.js";
import logger, { morganStream } from "./logger.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: originValidator,
      credentials: true,
    }),
  );

  app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
      stream: morganStream,
    }),
  );

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Welcome to the Creator Platform API! 🚀");
  });

  app.get("/api/health", (req, res) => {
    res.json({ message: "BlogHub Server is healthy!" });
  });

  // Keep both auth and users prefixes for backward compatibility.
  app.use("/api/auth", userRoutes);
  app.use("/api/users", userRoutes);

  app.use((error, req, res, next) => {
    if (error.message === "CORS origin not allowed") {
      logger.warn("Blocked CORS request", { origin: req.headers.origin });
      return res.status(403).json({
        success: false,
        message: "Origin not allowed",
      });
    }

    return next(error);
  });

  return app;
};

const app = createApp();

export default app;
