import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import User from "./models/User.js";
import { createApp } from "./app.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST || process.env.MONGO_URI
    : process.env.MONGO_URI;

if (!dbURI) {
  console.error("ERROR: MONGO_URI is not defined in your .env file!");
  process.exit(1);
}

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret-change-me",
    );
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
  console.log(
    `✅ User connected: ${socket.id} | User: ${socket.data.user.email}`,
  );
});
const app = createApp();
app.use("/api/posts", postRoutes(io));
const httpServer = createServer(app);

io.attach(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
