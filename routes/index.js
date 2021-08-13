const express = require('express');

const router = express.Router();

const sandwichController = require('../controllers/sandwichController');
const categoryController = require('../controllers/categoryController');

router.get('/', (req, res) => {
  res.render('index', { title: 'Generic Sandwich Shop' });
});

router.get('/sandwiches', sandwichController.sandwich_list);
router.get('/sandwiches/:id', sandwichController.sandwich_detail);

router.get('/categories', categoryController.category_list);
router.get('/categories/:id', categoryController.category_detail);

module.exports = router;
