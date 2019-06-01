const mongoose = require('mongoose');

const SpiceSchema = new mongoose.Schema({
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  blends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blend',
  }],
  flavors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'flavor',
  }],
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ingredient',
  }],
  regions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'region',
  }],
});

module.exports = mongoose.model('spice', SpiceSchema);
