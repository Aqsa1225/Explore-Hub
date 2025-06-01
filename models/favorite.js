// Import Mongoose to define schemas and interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for the favorite images
const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who liked the image
  title: String, // Title or name of the image
  imgUrl: String, // Image URL
  desc: String, // Optional description for the image
});

// Create the Favorite model using the schema
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite; // This exports the Favorite model
