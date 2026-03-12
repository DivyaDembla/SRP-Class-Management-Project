const express = require("express");
const router = express.Router();
const IncomeEntry = require("../models/IncomeEntry");

// =============================
// GET ALL INCOME ENTRIES
// =============================
router.get("/", async (req, res) => {
  try {
    const entries = await IncomeEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// CREATE NEW INCOME ENTRY
// =============================
router.post("/", async (req, res) => {
  try {
    const {
      incomeCategory,
      date,
      studentName,
      className,
      section,
      amount,
      paymentMode,
      physicalReceipt,
      remarks,
      documentName,
    } = req.body;

    const newEntry = new IncomeEntry({
      incomeCategory,
      date,
      studentName,
      className,
      section,
      amount,
      paymentMode,
      physicalReceipt,
      remarks,
      documentName,
    });

    const savedEntry = await newEntry.save();

    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// DELETE ENTRY
// =============================
router.delete("/:id", async (req, res) => {
  try {
    await IncomeEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Income entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// UPDATE ENTRY
// =============================
router.put("/:id", async (req, res) => {
  try {
    const updatedEntry = await IncomeEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
