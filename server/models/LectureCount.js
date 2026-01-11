const mongoose = require("mongoose");

const lectureCountSchema = new mongoose.Schema(
  {
    teacher: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔒 prevent duplicate teacher + subject records
lectureCountSchema.index({ teacher: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("LectureCount", lectureCountSchema);
