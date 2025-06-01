// Import required modules
const express = require('express');
const router = express.Router();
const MarsSearch = require('../models/MarsSearch');
const { ensureAuthenticated } = require('../middleware/auth');

// Route: Save Mars Rover search (rover name + earth date) to the database
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { rover, earthDate } = req.body;
    // Create a new MarsSearch document with userId, rover, and date
    const newSearch = new MarsSearch({
      userId: req.user._id,
      rover,
      earthDate
    });
    // Save the search record to the database
    await newSearch.save();
    res.status(201).json({ message: 'Search saved successfully' });
  } catch (err) {
    console.error('❌ Error saving search:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Export the router
module.exports = router;
