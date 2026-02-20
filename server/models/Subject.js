const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    standard: {
      type: String,
      required: true,
    },

    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subject", SubjectSchema);
