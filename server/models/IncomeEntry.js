const mongoose = require("mongoose");

const IncomeEntrySchema = new mongoose.Schema(
  {
    incomeCategory: {
      type: String,
      enum: ["Student Fee", "Other Income"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    studentName: {
      type: String,
      trim: true,
      default: "N/A",
    },

    classSection: {
      type: String,
      trim: true,
      default: "N/A",
    },

    feeType: {
      type: String,
      trim: true,
      default: "N/A",
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMode: {
      type: String,
      required: true,
      trim: true,
    },

    physicalReceipt: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },

    documentName: {
      type: String, // just filename for now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncomeEntry", IncomeEntrySchema);