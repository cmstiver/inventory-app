const express = require('express');

const router = express.Router();

const sandwichController = require('../controllers/sandwichController');
const countryController = require('../controllers/countryController');

router.get('/', (req, res) => {
  res.render('index', { title: 'Generic Sandwich Shop' });
});

router.get('/sandwiches/create', sandwichController.sandwich_create_get);
router.post('/sandwiches/create', sandwichController.sandwich_create_post);
router.get('/sandwiches/:id/update', sandwichController.sandwich_update_get);
router.post('/sandwiches/:id/update', sandwichController.sandwich_update_post);
router.get('/sandwiches/:id/delete', sandwichController.sandwich_delete_get);
router.post('/sandwiches/:id/delete', sandwichController.sandwich_delete_post);
router.get('/sandwiches', sandwichController.sandwich_list);
router.get('/sandwiches/:id', sandwichController.sandwich_detail);

router.get('/countries/create', countryController.country_create_get);
router.post('/countries/create', countryController.country_create_post);
router.get('/countries/:id/update', countryController.country_update_get);
router.post('/countries/:id/update', countryController.country_update_post);
router.get('/countries/:id/delete', countryController.country_delete_get);
router.post('/countries/:id/delete', countryController.country_delete_post);
router.get('/countries', countryController.country_list);
router.get('/countries/:id', countryController.country_detail);

module.exports = router;
