const mongoose = require('mongoose');

const BlendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

module.exports = mongoose.model('blend', BlendSchema);
