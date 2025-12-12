const express = require("express");
const router = express.Router();
const multer = require("multer");
const Student = require("../models/Student");

// -------- MULTER STORAGE --------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")),
});

const upload = multer({ storage });

// -------- GET ALL STUDENTS --------
router.get("/", async (req, res) => {
  try {
    const list = await Student.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------- ADD NEW STUDENT --------
router.post(
  "/",
  upload.fields([
    { name: "documentFile", maxCount: 1 },
    { name: "studentPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      const newStudent = new Student({
        ...body,
        documentFile: req.files.documentFile
          ? req.files.documentFile[0].path
          : null,
        studentPhoto: req.files.studentPhoto
          ? req.files.studentPhoto[0].path
          : null,
      });

      const saved = await newStudent.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
