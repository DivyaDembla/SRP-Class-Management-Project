const mongoose = require("mongoose");

const TeacherPaymentSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    teacherName: {
      type: String,
      required: true,
      trim: true,
    },

    standard: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    month: {
      type: String, // YYYY-MM
      required: true,
    },

    totalLectures: {
      type: Number,
      required: true,
      min: 0,
    },

    ratePerLecture: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherPayment", TeacherPaymentSchema);
