const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

/* ==============================
   GET all timetables
============================== */
router.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ createdAt: -1 });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   CREATE a new timetable
============================== */
router.post("/", async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    const saved = await timetable.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ==============================
   UPDATE a timetable by ID
============================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ==============================
   DELETE a timetable by ID
============================== */
router.delete("/:id", async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Timetable deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
