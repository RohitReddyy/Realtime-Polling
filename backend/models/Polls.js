const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  }
});

const Polls = mongoose.model('polls', pollSchema);
module.exports = Polls;
