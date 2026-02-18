const mongoose = require("mongoose");

const TeachingAssignmentSchema = new mongoose.Schema(
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
        required: true,
        trim: true,
      },
    ],
  },
  { _id: false },
);

const TeacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    emailAddress: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    // ⭐ NEW STRUCTURE
    teachingAssignments: [TeachingAssignmentSchema],

    documentNumber: { type: String, required: true },
    joiningDate: { type: String, required: true },

    status: { type: String, default: "Active" },

    fileName: { type: String, required: true },
    documentFile: { type: String }, // stored filename
  },
  { timestamps: true },
);

module.exports = mongoose.model("Teacher", TeacherSchema);
