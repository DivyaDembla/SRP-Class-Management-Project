const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    expenseType: {
      type: String,
      required: true,
      trim: true,
    },

    expenseDescription: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseMaster", ExpenseSchema);
