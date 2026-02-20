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
    res.status(500).json({ error: err.message });
  }
});

/* ================= CREATE USER + LOGIN ACCOUNT ================= */
router.post("/", async (req, res) => {
  try {
    const { name, username, gender, role, location } = req.body;

    /* ---- Check duplicate user master ---- */
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    /* ---- Save user master ---- */
    const newUser = new User({
      name,
      username,
      gender,
      role,
      location,
    });

    const savedUser = await newUser.save();

    /* ---- Create login account automatically ---- */
    const existingAuth = await AuthUser.findOne({ username });

    if (!existingAuth) {
      const hashedPassword = await bcrypt.hash(username, 10);

      const loginUser = new AuthUser({
        name,
        username,
        password: hashedPassword,
      });

      await loginUser.save();
    }

    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE USER ================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
