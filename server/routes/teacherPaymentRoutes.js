const express = require("express");
const router = express.Router();
const TeacherPayment = require("../models/TeacherPayment");

/* ================= CREATE PAYMENT (FETCH CLICK) ================= */
router.post("/", async (req, res) => {
  try {
    const {
      teacherId,
      teacherName,
      standard,
      section,
      subject,
      month,
      totalLectures,
      ratePerLecture,
      totalAmount,
    } = req.body;

    // 🔒 basic validation
    if (
      !teacherId ||
      !teacherName ||
      !standard ||
      !section ||
      !subject ||
      !month
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = new TeacherPayment({
      teacherId,
      teacherName,
      standard,
      section,
      subject,
      month,
      totalLectures,
      ratePerLecture,
      totalAmount,
      status: "Paid",
    });

    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL PAYMENTS (REPORT) ================= */
router.get("/", async (req, res) => {
  try {
    const payments = await TeacherPayment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET PAYMENTS BY MONTH ================= */
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

/* ================= MARK AS PAID ================= */
router.put("/:id/pay", async (req, res) => {
  try {
    const updatedPayment = await TeacherPayment.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(updatedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
