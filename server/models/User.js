const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userCode: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
