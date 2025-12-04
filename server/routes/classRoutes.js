const express = require("express");
const router = express.Router();
const Class = require("../models/Class");

// GET all classes
router.get("/", async (req, res) => {
  try {
    const list = await Class.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE class
router.post("/", async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const saved = await newClass.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE class
router.put("/:id", async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const item = await Class.findById(req.params.id);
    item.status = item.status === "Active" ? "Inactive" : "Active";
    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
