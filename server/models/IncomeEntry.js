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

    // Student name OR manual name (for other income)
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      trim: true,
      default: null,
    },

    section: {
      type: String,
      trim: true,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
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
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("IncomeEntry", IncomeEntrySchema);
