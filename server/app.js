import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
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

  return app;
};

const app = createApp();

export default app;
