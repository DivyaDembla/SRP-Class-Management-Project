const express = require("express");
const router = express.Router();
const multer = require("multer");
const Teacher = require("../models/Teacher");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/teachers"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// =================================================
// GET ALL TEACHERS
// =================================================
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================================================
// CREATE TEACHER
// =================================================
router.post("/", upload.single("documentFile"), async (req, res) => {
  try {
    const teacherData = {
      fullName: req.body.fullName,
      mobileNumber: req.body.mobileNumber,
      emailAddress: req.body.emailAddress,
      qualification: req.body.qualification,
      address: req.body.address,
      documentNumber: req.body.documentNumber,
      joiningDate: req.body.joiningDate,
      status: req.body.status,
      fileName: req.body.fileName,

      // ⭐ parse mapping array
      teachingAssignments: JSON.parse(req.body.teachingAssignments || "[]"),

      documentFile: req.file ? req.file.filename : null,
    };

    const newTeacher = new Teacher(teacherData);
    const saved = await newTeacher.save();

    res.status(201).json(saved);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =================================================
// UPDATE TEACHER
// =================================================
router.put("/:id", upload.single("documentFile"), async (req, res) => {
  try {
    const updatedData = {
      fullName: req.body.fullName,
      mobileNumber: req.body.mobileNumber,
      emailAddress: req.body.emailAddress,
      qualification: req.body.qualification,
      address: req.body.address,
      documentNumber: req.body.documentNumber,
      joiningDate: req.body.joiningDate,
      status: req.body.status,
      fileName: req.body.fileName,
    };

    if (req.body.teachingAssignments) {
      updatedData.teachingAssignments = JSON.parse(
        req.body.teachingAssignments,
      );
    }

    if (req.file) {
      updatedData.documentFile = req.file.filename;
    }

    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =================================================
// DELETE TEACHER
// =================================================
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
