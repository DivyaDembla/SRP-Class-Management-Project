const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// GET all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new location
router.post("/", async (req, res) => {
  try {
    const { locationName, address } = req.body;

    const newLocation = new Location({
      locationName,
      address,
    });

    const saved = await newLocation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
