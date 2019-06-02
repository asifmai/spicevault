const express = require('express');

const router = express.Router();
const auth = require('../config/auth');

const adminController = require('../controllers/adminController');

/* GET - Private - Show Admin Dashboard. */
router.get('/', auth.ensureAuthenticatedAdmin, adminController.dashboard_get);

/* GET - Public - Show Admin Login page. */
router.get('/login', auth.ensureAuthenticatedAdminLogin, adminController.adminlogin_get);

/* GET - Public - Authenticate ADmin. */
router.post('/login', adminController.adminlogin_post);

/* GET - Private - Log Out Admin. */
router.get('/logout', adminController.logout_get)

/* GET - Private - Show Spices Page. */
router.get('/spices', auth.ensureAuthenticatedAdmin, adminController.spices_get)

/* GET - Private - Show Add Spice Page. */
router.get('/addspice', auth.ensureAuthenticatedAdmin, adminController.addspice_get)

/* POST - Private - Add Spice. */
router.post('/addspice', auth.ensureAuthenticatedAdmin, adminController.addspice_post)

/* GET - Private - Delete Spice. */
router.get('/deletespice/:spiceid', auth.ensureAuthenticatedAdmin, adminController.deletespice_get)

/* GET - Private - Show Edit spice Page. */
router.get('/editspice/:spiceid', auth.ensureAuthenticatedAdmin, adminController.editspice_get)

/* POST - Private - Edit spice */
router.post('/editspice', auth.ensureAuthenticatedAdmin, adminController.editspice_post)

/* GET - Private - Show Blends Page. */
router.get('/blends', auth.ensureAuthenticatedAdmin, adminController.blends_get)

/* POST - Private - Add New Blend. */
router.post('/addblend', auth.ensureAuthenticatedAdmin, adminController.addblend_post);

/* GET - Private - Delete Blend. */
router.get('/deleteblend/:blendid', auth.ensureAuthenticatedAdmin, adminController.deleteblend_get)

/* GET - Private - Show Edit Blend Page. */
router.get('/editblend/:blendid', auth.ensureAuthenticatedAdmin, adminController.editblend_get)

/* POST - Private - Edit Blend */
router.post('/editblend', auth.ensureAuthenticatedAdmin, adminController.editblend_post)

/* GET - Private - Show Flavors Page. */
router.get('/flavors', auth.ensureAuthenticatedAdmin, adminController.flavors_get)

/* POST - Private - Add New Flavor. */
router.post('/addflavor', auth.ensureAuthenticatedAdmin, adminController.addflavor_post);

/* GET - Private - Delete Flavor. */
router.get('/deleteflavor/:flavorid', auth.ensureAuthenticatedAdmin, adminController.deleteflavor_get)

/* GET - Private - Show Edit Flavor Page. */
router.get('/editflavor/:flavorid', auth.ensureAuthenticatedAdmin, adminController.editflavor_get)

/* POST - Private - Edit Flavor */
router.post('/editflavor', auth.ensureAuthenticatedAdmin, adminController.editflavor_post)

/* GET - Private - Show Ingredients Page. */
router.get('/ingredients', auth.ensureAuthenticatedAdmin, adminController.ingredients_get)

/* POST - Private - Add New Ingredient. */
router.post('/addingredient', auth.ensureAuthenticatedAdmin, adminController.addingredient_post);

/* GET - Private - Delete Ingredient. */
router.get('/deleteingredient/:ingredientid', auth.ensureAuthenticatedAdmin, adminController.deleteingredient_get)

/* GET - Private - Show Edit ingredient Page. */
router.get('/editingredient/:ingredientid', auth.ensureAuthenticatedAdmin, adminController.editingredient_get)

/* POST - Private - Edit ingredient */
router.post('/editingredient', auth.ensureAuthenticatedAdmin, adminController.editingredient_post)

/* GET - Private - Show Regions Page. */
router.get('/regions', auth.ensureAuthenticatedAdmin, adminController.regions_get)

/* POST - Private - Add New Region. */
router.post('/addregion', auth.ensureAuthenticatedAdmin, adminController.addregion_post);

/* GET - Private - Delete Region. */
router.get('/deleteregion/:regionid', auth.ensureAuthenticatedAdmin, adminController.deleteregion_get)

/* GET - Private - Show Edit region Page. */
router.get('/editregion/:regionid', auth.ensureAuthenticatedAdmin, adminController.editregion_get)

/* POST - Private - Edit region */
router.post('/editregion', auth.ensureAuthenticatedAdmin, adminController.editregion_post)


module.exports = router;
