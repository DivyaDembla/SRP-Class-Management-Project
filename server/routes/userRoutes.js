const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const AuthUser = require("../models/AuthUser");

/* ================= GET ALL USERS ================= */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* ================= CREATE USER + LOGIN ACCOUNT ================= */
router.post("/", async (req, res) => {
  try {
    let { name, username, gender, role, location } = req.body;

    // 🔹 Normalize username
    username = username?.trim().toLowerCase();

    // 🔹 Validation
    if (!name || !username || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!Array.isArray(location) || location.length === 0) {
      return res.status(400).json({ message: "Location is required" });
    }

    /* ---- Check duplicate ---- */
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    /* ---- Save User ---- */
    const newUser = new User({
      name,
      username,
      gender,
      role,
      location,
    });

    const savedUser = await newUser.save();

    /* ---- Create AuthUser (SAFE) ---- */
    try {
      const existingAuth = await AuthUser.findOne({ username });

      if (!existingAuth) {
        const hashedPassword = await bcrypt.hash(username, 10);

        await new AuthUser({
          name,
          username,
          password: hashedPassword,
          role,
        }).save();
      }
    } catch (authErr) {
      console.error("AuthUser ERROR:", authErr.message);
      // don't break main flow
    }

    res.status(201).json(savedUser);
  } catch (err) {
    console.error("POST USER ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message || "Server error" });
  }
});

/* ================= UPDATE USER ================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
