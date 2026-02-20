const express = require("express");
const router = express.Router();

const LectureEntry = require("../models/LectureEntry");
const TeacherSubjectLectureCount = require("../models/TeacherSubjectLectureCount");

// GET ALL LECTURES
router.get("/", async (req, res) => {
  try {
    const lectures = await LectureEntry.find().sort({ createdAt: -1 });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE LECTURE + INCREMENT COUNT (MONTH AWARE) */
router.post("/", async (req, res) => {
  try {
    const lecture = new LectureEntry(req.body);
    const savedLecture = await lecture.save();

    // ✅ derive month from date (YYYY-MM)
    const month = req.body.date.slice(0, 7);

    await TeacherSubjectLectureCount.findOneAndUpdate(
      {
        teacher: req.body.teacher,
        subject: req.body.subject,
        month, // ✅ IMPORTANT
      },
      {
        $inc: { totalLectures: 1 },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json(savedLecture);
  } catch (err) {
    console.error("LECTURE SAVE ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

/* DELETE LECTURE + DECREMENT COUNT (MONTH AWARE) */
router.delete("/:id", async (req, res) => {
  try {
    const lecture = await LectureEntry.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const month = lecture.date.slice(0, 7);

    await TeacherSubjectLectureCount.findOneAndUpdate(
      {
        teacher: lecture.teacher,
        subject: lecture.subject,
        month, // ✅ IMPORTANT
      },
      {
        $inc: { totalLectures: -1 },
      }
    );

    await LectureEntry.findByIdAndDelete(req.params.id);

    res.json({ message: "Lecture deleted successfully" });
  } catch (err) {
    console.error("DELETE LECTURE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
