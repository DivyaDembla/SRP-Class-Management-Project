const express = require("express");
const router = express.Router();
const LectureCount = require("../models/TeacherSubjectLectureCount");

/**
 * GET lecture count by teacher + subject + month
 * If month does not match → returns 0
 */
router.get("/", async (req, res) => {
  try {
    const { teacher, subject, month } = req.query;

    // safety check
    if (!teacher || !subject || !month) {
      return res.json({ totalLectures: 0 });
    }

    const record = await LectureCount.findOne({
      teacher,
      subject,
      month,
    });

    res.json({
      totalLectures: record ? record.totalLectures : 0,
    });
  } catch (err) {
    console.error("LECTURE COUNT ERROR:", err.message);
    res.status(500).json({ totalLectures: 0 });
  }
});

module.exports = router;
