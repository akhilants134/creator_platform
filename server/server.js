// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Enhanced Connection Logic
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error("ERROR: MONGO_URI is not defined in your .env file!");
} else {
  mongoose
    .connect(dbURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
}

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
app.get("/", (req, res) => {
  res.send("Welcome to the Creator Platform API! 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ message: "BlogHub Server is healthy!" });
});

// Keep both auth and users prefixes for backward compatibility.
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes(io));

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
