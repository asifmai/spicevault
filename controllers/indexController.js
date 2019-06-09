const Spice = require('../models/Spice');
const Blend = require('../models/Blend');
const Flavor = require('../models/Flavor');
const Ingredient = require('../models/Ingredient');
const Region = require('../models/Region');

// Display Landing Page
module.exports.index_get = async (req, res, next) => {
  console.log(req.query);
  const query = {}
  query.searchtext = typeof req.query.searchtext != 'undefined' ? req.query.searchtext.trim().toLowerCase() : '';
  query.blends = typeof req.query.blends != 'undefined' ? req.query.blends : '';
  query.flavors = typeof req.query.flavors != 'undefined' ? req.query.flavors : '';
  query.ingredients = typeof req.query.ingredients != 'undefined' ? req.query.ingredients : '';
  query.regions = typeof req.query.regions != 'undefined' ? req.query.regions : '';
  
  const spicesQuery = Spice.find();
  const blends = await Blend.find();
  const flavors = await Flavor.find();
  const ingredients = await Ingredient.find();
  const regions = await Region.find();
  const allspices = await Spice.find();

  if (query.blends !== '') {
    if (Array.isArray(query.blends)) spicesQuery.where({blends: {$all: query.blends}});
    else spicesQuery.where({blends: {$in: query.blends}});
  };

  if (query.flavors !== '') {
    if (Array.isArray(query.flavors)) spicesQuery.where({flavors: {$all: query.flavors}});
    else spicesQuery.where({flavors: {$in: query.flavors}});
  }

  if (query.ingredients !== '') {
    if (Array.isArray(query.ingredients)) spicesQuery.where({ingredients: {$all: query.ingredients}});
    else spicesQuery.where({ingredients: {$in: query.ingredients}});
  }

  if (query.regions !== '') {
    if (Array.isArray(query.regions)) spicesQuery.where({regions: {$all: query.regions}});
    else spicesQuery.where({regions: {$in: query.regions}});
  }

  if (query.searchtext !== '') {
    spicesQuery.where({name: {$regex: `${query.searchtext}`, $options: 'i'}});
  }
  
  const spices = await spicesQuery.sort({name: 'asc'}).exec();
  res.render('index', {spices, blends, flavors, ingredients, regions, query: req.query, allspices});
};
