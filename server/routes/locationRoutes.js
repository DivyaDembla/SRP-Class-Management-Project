const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

/* -------------------------------------------------- */
/* HELPER: GENERATE UNIQUE LOCATION ID */
/* -------------------------------------------------- */
const generateLocationId = async (locationName, pincode) => {
  // Take first 2 letters only alphabets
  const prefix = locationName
    .replace(/[^A-Za-z]/g, "")
    .substring(0, 2)
    .toUpperCase();

  // last 2 digits of pincode
  const suffix = pincode.slice(-2);

  let baseId = prefix + suffix;
  let finalId = baseId;
  let counter = 1;

  // Ensure uniqueness
  while (await Location.findOne({ locationId: finalId })) {
    finalId = baseId + counter;
    counter++;
  }

  return finalId;
};

/* ---------------- GET ALL LOCATIONS ---------------- */
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- CREATE LOCATION ---------------- */
router.post("/", async (req, res) => {
  try {
    const { locationName, pincode, city } = req.body;

    // validation
    if (!locationName || !pincode || !city) {
      return res.status(400).json({
        error: "Location Name, Pincode and City are required",
      });
    }

    // generate fields
    const locationId = await generateLocationId(locationName, pincode);
    const locationCode = pincode;

    const newLocation = new Location({
      locationId,
      locationName,
      pincode,
      locationCode,
      city,
    });

    const saved = await newLocation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);

    // duplicate key
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Location already exists",
      });
    }

    // mongoose validation
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: err.message,
      });
    }

    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
