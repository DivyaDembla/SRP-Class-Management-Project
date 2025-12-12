const express = require("express");
const router = express.Router();
const Role = require("../models/Role");

// GET ALL ROLES
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE ROLE
router.post("/", async (req, res) => {
  try {
    const { roleName, roleDescription } = req.body;

    const newRole = new Role({
      roleName,
      roleDescription,
    });

    const saved = await newRole.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
