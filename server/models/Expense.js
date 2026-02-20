const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    expenseType: { type: String, required: true },
    amount: { type: Number, required: true },
    paidTo: { type: String, required: true },
    paymentMode: { type: String, required: true },
    remarks: { type: String },

    fileName: { type: String },
    documentFile: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);