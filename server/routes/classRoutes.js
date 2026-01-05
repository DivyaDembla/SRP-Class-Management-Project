const express = require("express");
const router = express.Router();
const Class = require("../models/Class");

/* ===============================
   GET ALL CLASSES
================================ */
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   CREATE CLASS
================================ */
router.post("/", async (req, res) => {
  try {
    const newClass = new Class({
      name: req.body.name,
      section: req.body.section,
      description: req.body.description,
      status: req.body.status || "Active",
      financialYear: req.body.financialYear,
    });

    const saved = await newClass.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   UPDATE CLASS (EDIT)
================================ */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        section: req.body.section,
        description: req.body.description,
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   TOGGLE ACTIVE / INACTIVE
================================ */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ error: "Class not found" });
    }

    cls.status = cls.status === "Active" ? "Inactive" : "Active";
    await cls.save();

    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   DELETE CLASS (OPTIONAL)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
