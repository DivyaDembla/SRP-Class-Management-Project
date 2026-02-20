const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Permission = require("../models/Permission");

// 1️⃣ Fetch user details + permissions
router.get("/:userCode", async (req, res) => {
  try {
    const user = await User.findOne({ userCode: req.params.userCode });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Try to fetch permissions for this user
    const perm = await Permission.findOne({ userCode: req.params.userCode });

    res.json({
      user,
      permissions: perm ? perm.permissions : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Update permissions
router.post("/update", async (req, res) => {
  const { userCode, permissions } = req.body;

  try {
    const updated = await Permission.findOneAndUpdate(
      { userCode },
      { userCode, permissions },
      { new: true, upsert: true } // Create if not exists
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
