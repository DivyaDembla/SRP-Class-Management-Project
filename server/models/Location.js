const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    locationName: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid Indian pincode"],
    },

    locationCode: {
      type: String,
      required: true,
      unique: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Location", LocationSchema);
