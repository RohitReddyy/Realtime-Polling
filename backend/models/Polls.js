const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  }
});

const Polls = mongoose.model('polls', pollSchema);
module.exports = Polls;
