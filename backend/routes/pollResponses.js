const express = require('express');
const router = express.Router();
const PollResponse = require('../models/PollResponse'); // Assuming you have a PollResponse model

// Route to handle submission of poll responses
router.post('/', async (req, res) => {
  try {
    // Extract poll response data from the request body
    const { pollId, userId, selectedOption } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Create a new poll response document
    const pollResponse = new PollResponse({
      pollId,
      userId, // If you have user authentication
      selectedOption,
      submittedAt: new Date(), // Timestamp
    });

    // Save the poll response to the database
    await pollResponse.save();

    // Respond with a success message
    res.status(201).json({ message: 'Poll response submitted successfully' });
  } catch (error) {
    console.error('Error submitting poll response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:pollId', async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const responses = await PollResponse.find({ pollId });
    const totalVotes = responses.length;
    const optionCounts = {};
    responses.forEach((response) => {
      optionCounts[response.selectedOption] = (optionCounts[response.selectedOption] || 0) + 1;
    });
    const percentages = {};
    for (const option in optionCounts) {
      percentages[option] = ((optionCounts[option] / totalVotes) * 100).toFixed(2);
    }
    res.json({ success: true, data: { percentages, totalVotes } });
  } catch (error) {
    console.error('Error fetching poll responses:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
