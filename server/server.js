// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
});
