const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    userCode: { type: String, required: true, unique: true },
    permissions: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", PermissionSchema);
