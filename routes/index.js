const express = require('express');

const router = express.Router();
const auth = require('../config/auth');

const indexController = require('../controllers/indexController');

// @route   GET /
// @desc    Show Index Page
// @access  Public
router.get('/', indexController.index_get);

// @route   GET /
// @desc    Show Index Page
// @access  Public
router.get('/details/:spiceid', indexController.details_get);

// @route   GET /
// @desc    Show Index Page
// @access  Public
router.get('/blenddetails/:blendid', indexController.blenddetails_get);

module.exports = router;
