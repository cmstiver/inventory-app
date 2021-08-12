const express = require('express');
const async = require('async');

const Sandwich = require('../models/sandwich');

const router = express.Router();

exports.sandwich_list = (req, res, next) => {
  Sandwich.find({}, 'name price')
    .sort([['name', 'ascending']])
    .exec((err, listSandwiches) => {
      if (err) {
        return next(err);
      }
      return res.render('sandwich_list', { title: 'Sandwich List', sandwich_list: listSandwiches });
    });
};
