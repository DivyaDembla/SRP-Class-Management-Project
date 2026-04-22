const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthUser = require("../models/AuthUser");
const User = require("../models/User");

const router = express.Router();

/* ================= SIGN UP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existingUser = await AuthUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new AuthUser({
      name,
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await AuthUser.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= GET CURRENT USER ================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 get auth user (for username)
    const authUser = await AuthUser.findById(decoded.id).select("-password");

    if (!authUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 get role from User collection
    const mainUser = await User.findOne({ username: authUser.username });

    res.json({
      name: authUser.name,
      username: authUser.username,
      role: mainUser?.role || null, // ✅ THIS FIXES EVERYTHING
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
