const express = require('express');
const router = express.Router();
const SpaceFact = require('../models/spaceFact'); // Import the SpaceFact model

// GET route to fetch all space facts from MongoDB
router.get('/', async (req, res) => {
    try {
        // Fetch all space facts from MongoDB
        const spaceFacts = await SpaceFact.find(); 
        res.json(spaceFacts); // Return the space facts as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// POST route to add a new space fact to MongoDB
router.post('/', async (req, res) => {
    try {
        // Get the fact from the request body
        const newFact = req.body.fact;
        
        if (!newFact) {
            return res.status(400).json({ message: 'Fact is required!' });
        }
        
        // Create a new SpaceFact instance and save it to the database
        const spaceFact = new SpaceFact({ fact: newFact });
        await spaceFact.save();
        
        // Send a response with the newly added space fact
        res.status(201).json({ message: 'New space fact added', fact: newFact });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

module.exports = router;
