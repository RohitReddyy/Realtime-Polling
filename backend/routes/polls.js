const express = require('express');
const router = express.Router();
const Poll = require('../models/Polls');

module.exports = (io) => {
  // POST route to create a new poll
  router.post('/', async (req, res) => {
    try {
      const { question, options } = req.body;
      
      // Create the poll
      const poll = await Poll.create({ question, options });
      
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

  return router;
};
