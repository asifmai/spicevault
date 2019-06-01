const passport = require('passport');
const path = require('path');
const fs = require('fs');
const imgdownload = require('image-downloader');
const excelToJson = require('../helpers/exceltojson');
const Blend = require('../models/Blend');
const Flavor = require('../models/Flavor');
const Ingredient = require('../models/Ingredient');
const Region = require('../models/Region');
const Spice = require('../models/Spice');

// Display Landing Page
module.exports.adminlogin_get = (req, res, next) => {
  res.render('admin/login');
};

// Autenticate Admin
module.exports.adminlogin_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true,
  })(req, res, next);
};

// Logout Admin
module.exports.logout_get = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
};

// Show Admin Dashboard
module.exports.dashboard_get = (req, res, next) => {
  res.render('admin/dashboard');
};

// Show Spices Page
module.exports.spices_get = async (req, res, next) => {
  const spices = await Spice.find().populate('blends flavors ingredients regions').sort({name: 1}).exec();
  const blends = await Blend.find().sort({name: 1}).exec();
  const flavors = await Flavor.find().sort({name: 1}).exec();
  const ingredients = await Ingredient.find().sort({name: 1}).exec();
  const regions = await Region.find().sort({name: 1}).exec();
  res.render('admin/spices', {spices, blends, flavors, ingredients, regions});
};

// Show Add Spice Page
module.exports.addspice_get = async (req, res, next) => {
  const blends = await Blend.find().sort({name: 1}).exec();
  const flavors = await Flavor.find().sort({name: 1}).exec();
  const ingredients = await Ingredient.find().sort({name: 1}).exec();
  const regions = await Region.find().sort({name: 1}).exec();
  res.render('admin/addspice', {blends, flavors, ingredients, regions});
}

// Add Spice
module.exports.addspice_post = async (req, res, next) => {
  // console.log(req.body);
  let messages = [];
  let nSpice = {};
  if (req.body.name.trim() == '') messages.push('New Spice must have a name');
  if (req.body.description.trim() == '') messages.push('New Spice must have a description');
  if (req.body.imageurl.trim() == '' && !req.files) messages.push('New Spice must have an image');
  if (!req.body.blends) messages.push('New Spice must have Blends');
  if (!req.body.flavors) messages.push('New Spice must have Flavors');
  if (!req.body.ingredients) messages.push('New Spice must have Ingredients');
  if (!req.body.regions) messages.push('New Spice must have Regions');
  if (messages.length > 0 ) {
    const blends = await Blend.find().sort({name: 1}).exec();
    const flavors = await Flavor.find().sort({name: 1}).exec();
    const ingredients = await Ingredient.find().sort({name: 1}).exec();
    const regions = await Region.find().sort({name: 1}).exec();
    res.render('admin/addspice', {blends, flavors, ingredients, regions, messages});
  } else {
    nSpice.name = req.body.name.trim();
    nSpice.description = req.body.description.trim();
    nSpice.blends = Array.isArray(req.body.blends) ? req.body.blends : [req.body.blends]
    nSpice.flavors = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors]
    nSpice.ingredients = Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients]
    nSpice.regions = Array.isArray(req.body.regions) ? req.body.regions : [req.body.regions]
    const newSpice = new Spice(nSpice);
    const createdSpice = await newSpice.save();
    console.log(createdSpice);
    let imageField = '';
    if (req.files) {
      const extentionArray = req.files.image.name.split('.');
      const extension = extentionArray[extentionArray.length - 1];
      const imgPath = path.resolve(__dirname, `../public/images/spices/${createdSpice._id}.${extension}`);
      const file_img = req.files.image;
      file_img.mv(imgPath, (err => console.log(err)));
      imageField = `${createdSpice._id}.${extension}`
    } else {
      const extentionArray = req.body.imageurl.split('.');
      const extension = extentionArray[extentionArray.length - 1];
      const imgPath = path.resolve(__dirname, `../public/images/spices/${createdSpice._id}.${extension}`);
      await imgdownload({url: req.body.imageurl, dest: imgPath});
      imageField = `${createdSpice._id}.${extension}`
    }
    await Spice.findByIdAndUpdate(createdSpice._id, {image: imageField});
    req.flash('success_msg', 'New Spice Added');
    res.redirect('/admin/spices');
  }
}

// Delete Spice
module.exports.deletespice_get = async (req, res, next) => {
  const spiceid = req.params.spiceid;
  const spice = await Spice.findById(spiceid);
  const imgPath = path.resolve(__dirname, `../public/images/spices/${spice.image}`);
  if (fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
  }
  await Spice.findByIdAndDelete(spiceid);
  req.flash('success_msg', 'Spice Deleted...')
  res.redirect('/admin/spices');
}

// Show Blends Page
module.exports.blends_get = async (req, res, next) => {
  const blends = await Blend.find().sort({name: 1}).exec();
  res.render('admin/blends', {blends});
};

// Add New Blend
module.exports.addblend_post = async (req, res, next) => {
  console.log(req.body);
  if (req.body.name.trim() == '') {
    req.flash('error_msg', 'New Blend must have a name')
    res.redirect('/admin/blends');
  } else {
    const newBlend = new Blend({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    await newBlend.save()
    req.flash('success_msg', 'New Blend Saved')
    res.redirect('/admin/blends');
  }
};

// Delete Blend
module.exports.deleteblend_get = async (req, res, next) => {
  await Blend.findByIdAndDelete(req.params.blendid);
  req.flash('success_msg', 'Blend Deleted');
  res.redirect('/admin/blends');
};

// Show Flavors Page
module.exports.flavors_get = async (req, res, next) => {
  const flavors = await Flavor.find().sort({name: 1}).exec();
  res.render('admin/flavors', {flavors});
};

// Add New Flavor
module.exports.addflavor_post = async (req, res, next) => {
  console.log(req.body);
  if (req.body.name.trim() == '') {
    req.flash('error_msg', 'New Flavor must have a name')
    res.redirect('/admin/flavors');
  } else {
    const newFlavor = new Flavor({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    await newFlavor.save()
    req.flash('success_msg', 'New Flavor Saved')
    res.redirect('/admin/flavors');
  }
};

// Delete Blend
module.exports.deleteflavor_get = async (req, res, next) => {
  await Flavor.findByIdAndDelete(req.params.flavorid);
  req.flash('success_msg', 'Flavor Deleted');
  res.redirect('/admin/flavors');
};

// Show Ingredients Page
module.exports.ingredients_get = async (req, res, next) => {
  const ingredients = await Ingredient.find().sort({name: 1}).exec();
  res.render('admin/ingredients', {ingredients});
};

// Add New Ingredient
module.exports.addingredient_post = async (req, res, next) => {
  console.log(req.body);
  if (req.body.name.trim() == '') {
    req.flash('error_msg', 'New Ingredient must have a name')
    res.redirect('/admin/ingredients');
  } else {
    const newIngredient = new Ingredient({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    await newIngredient.save()
    req.flash('success_msg', 'New Ingredient Saved')
    res.redirect('/admin/ingredients');
  }
};

// Delete Ingredient
module.exports.deleteingredient_get = async (req, res, next) => {
  await Ingredient.findByIdAndDelete(req.params.ingredientid);
  req.flash('success_msg', 'Ingredient Deleted');
  res.redirect('/admin/ingredients');
};

// Show Regions Page
module.exports.regions_get = async (req, res, next) => {
  const regions = await Region.find().sort({name: 1}).exec();
  res.render('admin/regions', {regions});
};

// Add New Region
module.exports.addregion_post = async (req, res, next) => {
  console.log(req.body);
  if (req.body.name.trim() == '') {
    req.flash('error_msg', 'New Region must have a name')
    res.redirect('/admin/regions');
  } else {
    const newRegion = new Region({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    await newRegion.save()
    req.flash('success_msg', 'New Region Saved')
    res.redirect('/admin/regions');
  }
};

// Delete Region
module.exports.deleteregion_get = async (req, res, next) => {
  await Region.findByIdAndDelete(req.params.regionid);
  req.flash('success_msg', 'Region Deleted');
  res.redirect('/admin/regions');
};