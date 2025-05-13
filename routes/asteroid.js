const express = require('express');
const router = express.Router();
const Asteroid = require('../models/asteroid');
const { ensureAuthenticated } = require('../middleware/auth');

// 🔥 Route to auto-save asteroid data
router.post('/save', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const asteroids = req.body.asteroids;

  if (!Array.isArray(asteroids) || asteroids.length === 0) {
    return res.status(400).json({ message: 'No asteroid data provided.' });
  }

  try {
    const saved = [];

    for (const a of asteroids) {
      const exists = await Asteroid.findOne({ userId, name: a.name, date: a.date });
      if (exists) continue;

      const asteroid = new Asteroid({
        name: a.name,
        date: a.date,
        velocity: a.velocity,
        missDistance: a.missDistance,
        body: a.body,
        hazardous: a.hazardous,
        nasaUrl: a.nasaUrl,
        userId
      });

      await asteroid.save();
      saved.push(asteroid);
    }

    res.status(200).json({ message: 'Asteroids saved.', saved: saved.length });
  } catch (err) {
    console.error('❌ Save failed:', err);
    res.status(500).json({ error: 'Error saving asteroid data.' });
  }
});

module.exports = router;
