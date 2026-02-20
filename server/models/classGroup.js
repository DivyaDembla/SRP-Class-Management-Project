const mongoose = require("mongoose");

const ClassGroupSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    className: { type: String, required: true },
    address1: String,
    address2: String,
    city: String,
    pinCode: String,
    fax: String,
    emailId: String,
    gst: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassGroup", ClassGroupSchema);
