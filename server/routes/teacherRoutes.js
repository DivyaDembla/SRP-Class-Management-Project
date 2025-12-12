const express = require("express");
const router = express.Router();
const multer = require("multer");
const Teacher = require("../models/Teacher");

// Storage settings for documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/teachers"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ---------------------------------------------------
// GET ALL TEACHERS
// ---------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------
// CREATE TEACHER
// ---------------------------------------------------
router.post("/", upload.single("documentFile"), async (req, res) => {
  try {
    const newTeacher = new Teacher({
      ...req.body,
      subjects: JSON.parse(req.body.subjects),
      classes: JSON.parse(req.body.classes),
      batches: JSON.parse(req.body.batches),
      documentFile: req.file ? req.file.filename : null,
    });

    const saved = await newTeacher.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------
// UPDATE TEACHER BY ID
// ---------------------------------------------------
// ---------------------------------------------------
// UPDATE TEACHER BY ID
// ---------------------------------------------------
router.put("/:id", upload.single("documentFile"), async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // Parse JSON arrays sent from FormData
    if (req.body.subjects) {
      updatedData.subjects = JSON.parse(req.body.subjects);
    }
    if (req.body.classes) {
      updatedData.classes = JSON.parse(req.body.classes);
    }
    if (req.body.batches) {
      updatedData.batches = JSON.parse(req.body.batches);
    }

    // Handle file upload (if new file is selected)
    if (req.file) {
      updatedData.documentFile = req.file.filename;
    }

    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------
// DELETE TEACHER
// ---------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
