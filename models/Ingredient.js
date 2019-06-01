const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

module.exports = mongoose.model('ingredient', IngredientSchema);
