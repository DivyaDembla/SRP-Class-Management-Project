const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

/* =============================
   GET attendance by date/class
============================= */
router.get("/", async (req, res) => {
  try {
    const { date, className, section } = req.query;

    const attendance = await Attendance.findOne({
      date,
      className,
      section,
    });

    res.json(attendance || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   CREATE / UPDATE attendance
============================= */
router.post("/", async (req, res) => {
  try {
    const {
      academicYear,
      month,
      className,
      section,
      date,
      holiday,
      students,
    } = req.body;

    const existing = await Attendance.findOne({
      date,
      className,
      section,
    });

    if (existing) {
      existing.students = students;
      existing.holiday = holiday;
      await existing.save();
      return res.json(existing);
    }

    const attendance = new Attendance({
      academicYear,
      month,
      className,
      section,
      date,
      holiday,
      students,
    });

    const saved = await attendance.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =============================
   DELETE attendance
============================= */
router.delete("/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Attendance deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
