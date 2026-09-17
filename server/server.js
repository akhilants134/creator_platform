// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import { initDb } from "./config/db.js";
import User from "./models/User.js";
import { createApp } from "./app.js";
import { originValidator } from "./config/cors.js";
import logger from "./logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const dbURI =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

// Enhanced Connection Logic
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error("ERROR: MONGO_URI is not defined in your .env file!");
} else {
  mongoose
    .connect(dbURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
}

// This tells the server how to respond to the "/" path
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Creators Platform API!",
    status: "Online",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
if (!dbURI) {
  logger.error(
    "DATABASE_URL or POSTGRES_URL is not defined in environment variables"
  );
  process.exit(1);
}

if (!jwtSecret) {
  logger.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

// Initialize Neon PostgreSQL database
try {
  await initDb();
} catch (err) {
  logger.error("Database connection error", { message: err.message });
  process.exit(1);
}

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
    const user = await User.findById(decoded.userId);

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

const app = createApp(io);
const httpServer = createServer(app);

io.attach(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
