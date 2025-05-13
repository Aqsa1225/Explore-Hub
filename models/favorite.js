const mongoose = require('mongoose');

// Define the schema for the favorite images
const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  imgUrl: String,
  desc: String,
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite; // This exports the Favorite model
