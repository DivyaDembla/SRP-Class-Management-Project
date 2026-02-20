const express = require("express");
const router = express.Router();
const multer = require("multer");
const Student = require("../models/Student");

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")),
});

const upload = multer({ storage });

/* ===============================
   GET ALL STUDENTS
================================ */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   CREATE STUDENT
================================ */
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

/* ===============================
   UPDATE STUDENT (EDIT)
================================ */
router.put(
  "/:id",
  upload.fields([
    { name: "documentFile", maxCount: 1 },
    { name: "studentPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      Object.assign(student, req.body);

      if (req.files.documentFile) {
        student.documentFile = req.files.documentFile[0].path;
      }

      if (req.files.studentPhoto) {
        student.studentPhoto = req.files.studentPhoto[0].path;
      }

      const updated = await student.save();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ===============================
   ACTIVATE / DEACTIVATE STUDENT
================================ */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const newStatus = student.status === "Active" ? "Inactive" : "Active";

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   DELETE STUDENT (OPTIONAL)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
