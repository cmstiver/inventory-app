const express = require('express');
const async = require('async');

const Categories = require('../models/category');
const Sandwiches = require('../models/sandwich');

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

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Categories.findById(req.params.id).exec(callback);
      },

      category_sandwiches(callback) {
        Sandwiches.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category === null) {
        // No results.
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
      }
      // Successful, so render.
      return res.render('category_detail', {
        title: 'category Detail',
        category: results.category,
        category_sandwiches: results.category_sandwiches,
      });
    },
  );
};
