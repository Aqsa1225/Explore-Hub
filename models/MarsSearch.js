const mongoose = require('mongoose');

const marsSearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rover: { type: String, required: true },
  earthDate: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarsSearch', marsSearchSchema);
