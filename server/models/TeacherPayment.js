const mongoose = require("mongoose");

const TeacherPaymentSchema = new mongoose.Schema(
  {
    teacherName: {
      type: String,
      required: true,
      trim: true,
    },

    month: {
      type: String, // format: YYYY-MM (from <input type="month" />)
      required: true,
    },

    paymentType: {
      type: String,
      enum: ["Single Teacher Payment", "Bulk Payment"],
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
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherPayment", TeacherPaymentSchema);
