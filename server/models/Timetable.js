const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    day: { type: String, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },

    // 🔥 ADD THIS
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
