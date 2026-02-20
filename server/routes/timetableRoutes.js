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
   Update a timetable by ID
============================== */
// TOGGLE ACTIVE / INACTIVE
router.patch("/:id/toggle", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // 🔥 IMPORTANT SAFETY DEFAULT
    if (!timetable.status) {
      timetable.status = "Active";
    }

    timetable.status = timetable.status === "Active" ? "Inactive" : "Active";

    await timetable.save();
    res.json(timetable);
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
