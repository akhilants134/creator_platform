import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import User from "./models/User.js";
import { createApp } from "./app.js";
import { originValidator } from "./config/cors.js";
import logger from "./logger.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST || process.env.MONGO_URI
    : process.env.DATABASE_URL || process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!dbURI) {
  logger.error(
    "DATABASE_URL or MONGO_URI is not defined in environment variables",
  );
  process.exit(1);
}

if (!jwtSecret) {
  logger.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(dbURI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => {
    logger.error("MongoDB connection error", { message: err.message });
    process.exit(1);
  });

const io = new Server({
  cors: {
    origin: originValidator,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.data.user = user;
    return next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  logger.info("Socket connection established", {
    socketId: socket.id,
    userEmail: socket.data.user.email,
  });
});
const app = createApp();
app.use("/api/posts", postRoutes(io));
const httpServer = createServer(app);

io.attach(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
