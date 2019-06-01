const express = require('express');

const router = express.Router();
const auth = require('../config/auth');

const indexController = require('../controllers/indexController');

// @route   GET /
// @desc    Show Index Page
// @access  Public
router.get('/', indexController.index_get);

module.exports = router;
