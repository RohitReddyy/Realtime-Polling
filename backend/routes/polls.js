const express = require('express');
const router = express.Router();
const Poll = require('../models/Polls');

module.exports = (io) => {
  // POST route to create a new poll
  router.post('/', async (req, res) => {
    try {
      const { question, options, userId } = req.body;
      
      // Create the poll
      const poll = await Poll.create({ question, options, userId });
      
      // Emit the newly created poll to all connected clients
      io.emit('newPoll', poll);

      // Respond with the ID of the created poll
      res.json({ polls: { id: poll.id } });
    } catch (error) {
      console.error("Error creating poll:", error);
      res.status(500).json({ error: 'Error creating poll' });
    }
  });

  // GET route to fetch all polls
  router.get('/', async (_req, res) => {
    try {
      // Fetch all polls from the database
      const polls = await Poll.find();
      res.json({ polls });
    } catch (error) {
      console.error("Error fetching polls:", error);
      res.status(500).json({ error: 'Error fetching polls' });
    }
  });

  // Route to fetch a single poll by its ID
router.get('/:id', async (req, res) => {
  try {
    // Fetch the poll by its ID
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    res.json({ poll });
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ error: 'Error fetching poll' });
  }
});

  router.get('/history/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;

      // Fetch polls created by the specified user
      const userPolls = await Poll.find({ userId });

      // Respond with the user's polls
      res.json({ userPolls });
    } catch (error) {
      console.error("Error fetching user's polls:", error);
      res.status(500).json({ error: "Error fetching user's polls" });
    }
  });

  return router;
};
