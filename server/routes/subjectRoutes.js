const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

/* GET ALL SUBJECTS */
router.get("/", async (req, res) => {
  try {
    const data = await Subject.find().sort({ standard: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADD OR UPDATE SUBJECTS */
router.post("/", async (req, res) => {
  try {
    const { classId, standard, subjects } = req.body;

    let existing = await Subject.findOne({ classId });

    // if class already exists → APPEND subjects
    if (existing) {
      // merge old + new
      const mergedSubjects = [...new Set([...existing.subjects, ...subjects])];

      existing.subjects = mergedSubjects;
      await existing.save();

      return res.json(existing);
    }

    // create new
    const newData = await Subject.create({
      classId,
      standard,
      subjects,
    });

    res.json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
