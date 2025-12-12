const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    qualification: { type: String, required: true },
    address: { type: String, required: true },

    subjects: { type: [String], required: true },
    classes: { type: [String], required: true },
    batches: { type: [String], required: true },

    documentNumber: { type: String, required: true },
    joiningDate: { type: String, required: true },

    status: { type: String, default: "Active" },

    fileName: { type: String, required: true },
    documentFile: { type: String }, // uploaded file path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
