const express = require("express");
const router = express.Router();
const TeacherPayment = require("../models/TeacherPayment");

/* ---------------- GET ALL PAYMENTS (Report) ---------------- */
router.get("/", async (req, res) => {
  try {
    const payments = await TeacherPayment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- CREATE / SAVE PAYMENT ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      teacherName,
      month,
      paymentType,
      totalLectures,
      ratePerLecture,
      totalAmount,
    } = req.body;

    const payment = new TeacherPayment({
      teacherName,
      month,
      paymentType,
      totalLectures,
      ratePerLecture,
      totalAmount,
    });

    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- MARK PAYMENT AS PAID ---------------- */
router.put("/:id/pay", async (req, res) => {
  try {
    const updated = await TeacherPayment.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET PAYMENTS BY MONTH ---------------- */
router.get("/month/:month", async (req, res) => {
  try {
    const payments = await TeacherPayment.find({
      month: req.params.month,
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
