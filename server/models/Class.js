const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    section: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, default: "Active" },
    financialYear: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
