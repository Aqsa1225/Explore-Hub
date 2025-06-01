// Import Mongoose to define a schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for an asteroid entry
const asteroidSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Asteroid name is required
  date: { type: String, required: true },  // Observation date is required
  velocity: { type: String },  // Speed of the asteroid 
  missDistance: { type: String }, // Distance from Earth
  orbitingBody: { type: String }, // Body the asteroid is orbiting 
  hazardous: { type: Boolean }, // Whether it is potentially hazardous
  nasaUrl: { type: String }, // Link to NASA’s asteroid data 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who searched this
}, { timestamps: true });

// Export the model so it can be used in routes/controllers
module.exports = mongoose.model('Asteroid', asteroidSchema);
