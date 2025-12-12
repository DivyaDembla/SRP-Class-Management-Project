const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    locationName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
