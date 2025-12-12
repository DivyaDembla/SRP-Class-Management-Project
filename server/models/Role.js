const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true, trim: true },
    roleDescription: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
