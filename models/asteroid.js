const mongoose = require('mongoose');

const asteroidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true }, // e.g. "2025-May-10"
  velocity: { type: String },
  missDistance: { type: String },
  orbitingBody: { type: String },
  hazardous: { type: Boolean },
  nasaUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Asteroid', asteroidSchema);
