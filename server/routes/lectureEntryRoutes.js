const express = require("express");
const router = express.Router();
const LectureEntry = require("../models/LectureEntry");

/* =============================
   GET all lecture entries
============================= */
router.get("/", async (req, res) => {
  try {
    const lectures = await LectureEntry.find().sort({ createdAt: -1 });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   CREATE lecture entry
============================= */
router.post("/", async (req, res) => {
  try {
    const lecture = new LectureEntry(req.body);
    const saved = await lecture.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =============================
   DELETE lecture entry
============================= */
router.delete("/:id", async (req, res) => {
  try {
    await LectureEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecture deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
