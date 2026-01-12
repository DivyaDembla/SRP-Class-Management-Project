const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

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
    const { locationId, locationName, locationCode, address } = req.body;

    // Basic backend validation
    if (!locationId || !locationName || !locationCode || !address) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const newLocation = new Location({
      locationId,
      locationName,
      locationCode,
      address,
    });

    const saved = await newLocation.save();
    res.status(201).json(saved);
  } catch (err) {
    /* DUPLICATE KEY ERROR */
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        error: `${field} already exists`,
      });
    }

    /* VALIDATION ERROR */
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: err.message,
      });
    }

    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
