const mongoose = require('mongoose');

const FlavorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

module.exports = mongoose.model('flavor', FlavorSchema);