const mongoose = require("mongoose");

const TeacherClassRateSchema = new mongoose.Schema(
  {
    teacherName: {
      type: String,
      required: true,
    },
    classValue: {
      type: String,
      required: true,
    },
    sectionValue: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherClassRate", TeacherClassRateSchema);