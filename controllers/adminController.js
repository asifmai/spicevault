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
  const flavors = await Flavor.find().sort({name: 1}).exec();
  const ingredients = await Ingredient.find().sort({name: 1}).exec();
  const regions = await Region.find().sort({name: 1}).exec();
  res.render('admin/addspice', {flavors, ingredients, regions});
}

// Add Spice
module.exports.addspice_post = async (req, res, next) => {
  // console.log(req.body);
  let messages = [];
  let nSpice = {};
  if (req.body.name.trim() == '') messages.push('New Spice must have a name');
  if (req.body.description.trim() == '') messages.push('New Spice must have a description');
  if (req.body.imageurl.trim() == '' && !req.files) messages.push('New Spice must have an image');
  if (req.body.type.trim() == '') messages.push('New Spice must have an Type');
  
  if (messages.length > 0 ) {
    const flavors = await Flavor.find().sort({name: 1}).exec();
    const ingredients = await Ingredient.find().sort({name: 1}).exec();
    const regions = await Region.find().sort({name: 1}).exec();
    res.render('admin/addspice', {flavors, ingredients, regions, messages});
  } else {
    nSpice.name = req.body.name.trim();
    nSpice.description = req.body.description.trim();
    nSpice.type = req.body.type.trim();
    if (req.body.flavors) nSpice.flavors = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors]
    if (req.body.ingredients) nSpice.ingredients = Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients]
    if (req.body.regions) nSpice.regions = Array.isArray(req.body.regions) ? req.body.regions : [req.body.regions]
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

// Show Edit spice Page
module.exports.editspice_get = async (req, res, next) => {
  const spice = await Spice.findById(req.params.spiceid);
  const flavors = await Flavor.find().sort({name: 1}).exec();
  const ingredients = await Ingredient.find().sort({name: 1}).exec();
  const regions = await Region.find().sort({name: 1}).exec();
  res.render('admin/editspice', {spice, flavors, ingredients, regions});
};

// Edit spice
module.exports.editspice_post = async (req, res, next) => {
  // console.log(req.body);
  let messages = [];
  let nSpice = {};
  const spiceid = req.body.spiceid;
  const spice = await Spice.findById(spiceid);
  if (req.body.name.trim() == '') messages.push('Spice must have a name');
  if (req.body.description.trim() == '') messages.push('Spice must have a description');
  if (messages.length > 0 ) {
    const flavors = await Flavor.find().sort({name: 1}).exec();
    const ingredients = await Ingredient.find().sort({name: 1}).exec();
    const regions = await Region.find().sort({name: 1}).exec();
    res.render('admin/editspice', {spice, flavors, ingredients, regions, messages});
  } else {
    nSpice.name = req.body.name.trim();
    nSpice.description = req.body.description.trim();
    nSpice.type = req.body.type.trim();
    if (req.body.flavors) nSpice.flavors = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors]
    if (req.body.ingredients) nSpice.ingredients = Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients]
    if (req.body.regions) nSpice.regions = Array.isArray(req.body.regions) ? req.body.regions : [req.body.regions]
    const createdSpice = await Spice.findByIdAndUpdate(req.body.spiceid, nSpice);
    // console.log(createdSpice);
    let imageField = '';
    if (req.files || req.body.imageurl !== '') {
      fs.unlinkSync(path.resolve(__dirname, `../public/images/spices/${spice.image}`));
      if (req.files) {
        const extentionArray = req.files.image.name.split('.');
        const extension = extentionArray[extentionArray.length - 1];
        const imgPath = path.resolve(__dirname, `../public/images/spices/${spiceid}.${extension}`);
        const file_img = req.files.image;
        file_img.mv(imgPath, (err => console.log(err)));
        imageField = `${spiceid}.${extension}`
      } else {
        const extentionArray = req.body.imageurl.split('.');
        const extension = extentionArray[extentionArray.length - 1];
        const imgPath = path.resolve(__dirname, `../public/images/spices/${spiceid}.${extension}`);
        await imgdownload({url: req.body.imageurl, dest: imgPath});
        imageField = `${spiceid}.${extension}`
      }
      await Spice.findByIdAndUpdate(spiceid, {image: imageField});
    }
    req.flash('success_msg', 'Spice Modified Successfully');
    res.redirect('/admin/spices');
  }
};

// Show Blends Page
module.exports.blends_get = async (req, res, next) => {
  const blends = await Blend.find().populate('spices').sort({name: 1}).exec();
  const spices = await Spice.find().sort({name: 'asc'}).exec();
  res.render('admin/blends', {blends, spices});
};

// Add New Blend
module.exports.addblend_post = async (req, res, next) => {
  // console.log(req.body);
  if (req.body.name.trim() == '') {
    req.flash('error_msg', 'New Blend must have a name')
    res.redirect('/admin/blends');
  } else {
    const nBlend = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    }
    if (req.body.spices) nBlend.spices = Array.isArray(req.body.spices) ? req.body.spices : [req.body.spices] 
    const newBlend = new Blend(nBlend);
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

// Show Edit Blend Page
module.exports.editblend_get = async (req, res, next) => {
  const blend = await Blend.findById(req.params.blendid);
  const spices = await Spice.find().sort({name: 'asc'});
  res.render('admin/editblend', {blend, spices});
};

// Edit Blend
module.exports.editblend_post = async (req, res, next) => {
  const blend = await Blend.findById(req.body.blendid);
  const spices = await Spice.find().sort({name: 'asc'});
  let messages = [];
  if (req.body.name.trim() == '') messages.push('Blend must have a name...');
  if (messages.length > 0) {
    res.render('admin/editblend', {blend, messages, spices});
  } else {
    const nBlend = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    }
    if (req.body.spices) nBlend.spices = Array.isArray(req.body.spices) ? req.body.spices : [req.body.spices]
    await Blend.findByIdAndUpdate(req.body.blendid, nBlend);
    req.flash('success_msg', 'Blend Modified successfully...')
    res.redirect('/admin/blends');
  }
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

// Delete Flavor
module.exports.deleteflavor_get = async (req, res, next) => {
  await Flavor.findByIdAndDelete(req.params.flavorid);
  req.flash('success_msg', 'Flavor Deleted');
  res.redirect('/admin/flavors');
};

// Show Edit Flavor Page
module.exports.editflavor_get = async (req, res, next) => {
  const flavor = await Flavor.findById(req.params.flavorid);
  res.render('admin/editflavor', {flavor});
};

// Edit Flavor
module.exports.editflavor_post = async (req, res, next) => {
  const flavor = await Flavor.findById(req.body.flavorid);
  let messages = [];
  if (req.body.name.trim() == '') messages.push('Flavor must have a name...');
  if (messages.length > 0) {
    res.render('admin/editflavor', {flavor, messages});
  } else {
    await Flavor.findByIdAndUpdate(req.body.flavorid, {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    req.flash('success_msg', 'Flavor Modified successfully...')
    res.redirect('/admin/flavors');
  }
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

// Show Edit ingredient Page
module.exports.editingredient_get = async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.params.ingredientid);
  res.render('admin/editingredient', {ingredient});
};

// Edit ingredient
module.exports.editingredient_post = async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.body.ingredientid);
  let messages = [];
  if (req.body.name.trim() == '') messages.push('Ingredient must have a name...');
  if (messages.length > 0) {
    res.render('admin/editingredient', {ingredient, messages});
  } else {
    await Ingredient.findByIdAndUpdate(req.body.ingredientid, {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    req.flash('success_msg', 'Ingredient Modified successfully...')
    res.redirect('/admin/ingredients');
  }
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

// Show Edit region Page
module.exports.editregion_get = async (req, res, next) => {
  const region = await Region.findById(req.params.regionid);
  res.render('admin/editregion', {region});
};

// Edit region
module.exports.editregion_post = async (req, res, next) => {
  const region = await Region.findById(req.body.regionid);
  let messages = [];
  if (req.body.name.trim() == '') messages.push('Region must have a name...');
  if (messages.length > 0) {
    res.render('admin/editregion', {region, messages});
  } else {
    await Region.findByIdAndUpdate(req.body.regionid, {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    });
    req.flash('success_msg', 'Region Modified successfully...')
    res.redirect('/admin/regions');
  }
};