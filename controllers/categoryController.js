const express = require('express');
const async = require('async');

const Categories = require('../models/category');

const router = express.Router();

exports.category_list = (req, res, next) => {
  Categories.find({}, 'name')
    .sort([['name', 'ascending']])
    .exec((err, listCategories) => {
      if (err) {
        return next(err);
      }
      return res.render('category_list', { title: 'Category List', category_list: listCategories });
    });
};
