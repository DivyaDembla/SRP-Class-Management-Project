const mongoose = require("mongoose");

const teacherSubjectLectureCountSchema = new mongoose.Schema(
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

    month: {
      type: String, // YYYY-MM
      required: true,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "teachersubjectlecturecounts",
  }
);

module.exports = mongoose.model(
  "TeacherSubjectLectureCount",
  teacherSubjectLectureCountSchema
);
