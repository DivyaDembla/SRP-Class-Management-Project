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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ Auto deactivate expired records
    await TeacherClassRate.updateMany(
      {
        status: "Active",
        effectiveTo: { $ne: null, $lt: today }
      },
      {
        $set: { status: "Inactive" }
      }
    );

    // 2️⃣ Fetch updated data
    const rates = await TeacherClassRate.find().sort({ createdAt: -1 });

    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ UPDATE STATUS */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, effectiveFrom, effectiveTo } = req.body;

    const updateData = { status };

    if (effectiveFrom !== undefined) {
      updateData.effectiveFrom = effectiveFrom;
    }

    if (effectiveTo !== undefined) {
      updateData.effectiveTo = effectiveTo;
    }

    const updated = await TeacherClassRate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
