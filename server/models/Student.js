const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    rollNumber: String,
    fullName: String,
    mobile: String,
    altMobile: String,
    address: String,
    dob: String,
    admissionDate: String,
    gender: String,
    className: String,
    section: String,
    batch: String,
    fee: Number,
    feeOption: String,
    documentNumber: String,

    // stored file paths
    documentFile: String,
    studentPhoto: String,

    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
