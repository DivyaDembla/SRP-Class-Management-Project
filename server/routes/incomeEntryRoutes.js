const express = require("express");
const router = express.Router();
const IncomeEntry = require("../models/IncomeEntry");

// -----------------------------
// GET all income entries
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const entries = await IncomeEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// CREATE new income entry
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const {
      incomeCategory,
      date,
      studentName,
      classSection,
      feeType,
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
      classSection,
      feeType,
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

module.exports = router;
