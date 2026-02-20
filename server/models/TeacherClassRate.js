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
    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
    effectiveTo: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherClassRate", TeacherClassRateSchema);
