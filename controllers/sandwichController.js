const express = require('express');
const async = require('async');

const Sandwiches = require('../models/sandwich');

const router = express.Router();

exports.sandwich_list = (req, res, next) => {
  Sandwiches.find({}, 'name price')
    .sort([['name', 'ascending']])
    .exec((err, listSandwiches) => {
      if (err) {
        return next(err);
      }
      return res.render('sandwich_list', { title: 'Sandwich List', sandwich_list: listSandwiches });
    });
};

exports.sandwich_detail = (req, res, next) => {
  async.parallel(
    {
      sandwich(callback) {
        Sandwiches.findById(req.params.id).populate('category').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.sandwich == null) {
        const error = new Error('Sandwich not found');
        error.status = 404;
        return next(error);
      }
      return res.render('sandwich_detail', {
        name: results.sandwich.name,
        sandwich: results.sandwich,
      });
    },
  );
};
