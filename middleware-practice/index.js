const express = require("express");

const createUser = (email, role = "user") => ({
  email,
  role,
});

const users = {
  "admin@example.com": createUser("admin@example.com", "admin"),
  "user@example.com": createUser("user@example.com", "user"),
  "guest@example.com": createUser("guest@example.com"),
};

const app = express();

app.use(express.json());

function authenticateUser(req, res, next) {
  const email = req.body?.email;
  const user = email ? users[email] : null;

  if (!user) {
    return res.status(401).json({
      message: "Authentication required: User not found or email missing.",
    });
  }

  req.user = user;
  return next();
}

function isAdmin(req, res, next) {
  if (req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access Denied: Admins only.",
  });
}

app.get("/admin-dashboard", authenticateUser, isAdmin, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard!",
  });
});

module.exports = app;
