const express = require('express');

const router = express.Router();

const sandwichController = require('../controllers/sandwichController');
const countryController = require('../controllers/countryController');

router.get('/', (req, res) => {
  res.render('index', { title: 'Generic Sandwich Shop' });
});

router.get('/sandwiches', sandwichController.sandwich_list);
router.get('/sandwiches/:id', sandwichController.sandwich_detail);

router.get('/countries', countryController.country_list);
router.get('/countries/:id', countryController.country_detail);

module.exports = router;
