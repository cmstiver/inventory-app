const express = require('express');

const router = express.Router();

const sandwichController = require('../controllers/sandwichController');
const categoryController = require('../controllers/categoryController');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/sandwiches', sandwichController.sandwich_list);

router.get('/categories', categoryController.category_list);

module.exports = router;
