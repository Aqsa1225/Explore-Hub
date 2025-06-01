// Import Mongoose to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for storing Mars Rover search history
const marsSearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rover: { type: String, required: true },   // Name of the Mars rover used in the search (e.g., Curiosity, Opportunity)
  earthDate: { type: String, required: true },   // Earth date for which Mars photos were searched
  searchedAt: { type: Date, default: Date.now }   // Automatically store the timestamp of when the search was made
});

// Export the model so it can be used in routes/controllers
module.exports = mongoose.model('MarsSearch', marsSearchSchema);
