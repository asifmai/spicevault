const mongoose = require('mongoose');

const BlendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  spices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'spice',
  }]
});

module.exports = mongoose.model('blend', BlendSchema);
