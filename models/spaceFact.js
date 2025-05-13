// models/spaceFact.js
const mongoose = require('mongoose');

// Create a schema for space facts
const spaceFactSchema = new mongoose.Schema({
    fact: {
        type: String,
        required: true // Ensure that each space fact is a string and is required
    }
});

// Create the model for SpaceFact based on the schema
module.exports = mongoose.model('SpaceFact', spaceFactSchema);
