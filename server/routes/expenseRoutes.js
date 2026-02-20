const express = require("express");
const router = express.Router();
const multer = require("multer");
const Expense = require("../models/Expense");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/expenses"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", upload.single("documentFile"), async (req, res) => {
  try {
    const newExpense = new Expense({
      ...req.body,
      amount: Number(req.body.amount),
      documentFile: req.file ? req.file.filename : null,
    });

    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.single("documentFile"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      amount: Number(req.body.amount),
    };

    if (req.file) updateData.documentFile = req.file.filename;

    const updated = await Expense.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;