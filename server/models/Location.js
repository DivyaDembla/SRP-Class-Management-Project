const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,required: true,trim: true,uppercase: true,
      match: [/^[A-Z0-9]{2,10}$/, "Invalid Location ID"],unique: true,
    },
    locationName: { type: String, required: true, trim: true },
    locationCode: {
      type: String,required: true,trim: true,uppercase: true,
      match: [/^[A-Z0-9]{2,10}$/, "Invalid Location Code"],unique: true,
    },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
