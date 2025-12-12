const express = require("express");
const router = express.Router();
const ClassGroup = require("../models/classGroup");

// GET ALL CLASS GROUPS
router.get("/", async (req, res) => {
  try {
    const groups = await ClassGroup.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE CLASS GROUP
router.post("/", async (req, res) => {
  try {
    const newGroup = new ClassGroup(req.body);
    const saved = await newGroup.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE CLASS GROUP
router.put("/:id", async (req, res) => {
  try {
    const updated = await ClassGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
