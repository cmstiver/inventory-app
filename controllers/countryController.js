const express = require('express');
const async = require('async');

const Countries = require('../models/country');
const Sandwiches = require('../models/sandwich');

const router = express.Router();

exports.country_list = (req, res, next) => {
  Countries.find({}, 'name')
    .sort([['name', 'ascending']])
    .exec((err, listCountries) => {
      if (err) {
        return next(err);
      }
      return res.render('country_list', { title: 'country List', country_list: listCountries });
    });
};

exports.country_detail = (req, res, next) => {
  async.parallel(
    {
      country(callback) {
        Countries.findById(req.params.id).exec(callback);
      },

      country_sandwiches(callback) {
        Sandwiches.find({ country: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.country === null) {
        // No results.
        const error = new Error('country not found');
        error.status = 404;
        return next(error);
      }
      // Successful, so render.
      return res.render('country_detail', {
        title: 'country Detail',
        country: results.country,
        country_sandwiches: results.country_sandwiches,
      });
    },
  );
};
