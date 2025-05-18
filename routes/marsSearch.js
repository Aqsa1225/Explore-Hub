const express = require('express');
const router = express.Router();
const MarsSearch = require('../models/MarsSearch');
const { ensureAuthenticated } = require('../middleware/auth');

// ✅ Save Mars search to DB
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { rover, earthDate } = req.body;
    const newSearch = new MarsSearch({
      userId: req.user._id,
      rover,
      earthDate
    });
    await newSearch.save();
    res.status(201).json({ message: 'Search saved successfully' });
  } catch (err) {
    console.error('❌ Error saving search:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
