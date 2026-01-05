const express = require("express");
const router = express.Router();
const TeacherClassRate = require("../models/TeacherClassRate");

/* ✅ CREATE (Add rates) */
router.post("/", async (req, res) => {
  try {
    const rates = await TeacherClassRate.insertMany(req.body);
    res.status(201).json(rates);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ✅ READ (Get all rates) */
router.get("/", async (req, res) => {
  try {
    const rates = await TeacherClassRate.find().sort({ createdAt: -1 });
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ UPDATE STATUS */
router.patch("/:id/status", async (req, res) => {
  try {
    const rate = await TeacherClassRate.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(rate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ✅ UPDATE RATE (EDIT) */
router.put("/:id", async (req, res) => {
  try {
    const updatedRate = await TeacherClassRate.findByIdAndUpdate(
      req.params.id,
      {
        teacherName: req.body.teacherName,
        classValue: req.body.classValue,
        sectionValue: req.body.sectionValue,
        subject: req.body.subject,
        rate: req.body.rate,
      },
      { new: true }
    );

    res.json(updatedRate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
