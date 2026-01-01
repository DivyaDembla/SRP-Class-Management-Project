const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
  rollNo: Number,
  name: String,
  attendance: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Present",
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    date: {
      type: String, // yyyy-mm-dd
      required: true,
    },
    holiday: {
      type: Boolean,
      default: false,
    },
    students: [studentAttendanceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
