const express = require('express');
const async = require('async');
const { body, validationResult } = require('express-validator');

const Country = require('../models/country');
const Sandwich = require('../models/sandwich');

exports.country_list = (req, res, next) => {
  Country.find({}, 'name')
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
        Country.findById(req.params.id).exec(callback);
      },

      country_sandwiches(callback) {
        Sandwich.find({ country: req.params.id }).exec(callback);
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

exports.country_create_get = (req, res) => {
  res.render('country_form', { title: 'Create Country' });
};

exports.country_create_post = [
  body('name', 'Country name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const country = new Country({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('country_form', { title: 'Create Country', country, errors: errors.array() });
    } else {
      Country.findOne({ name: req.body.name }).exec((err, foundCountry) => {
        if (err) {
          return next(err);
        }

        if (foundCountry) {
          res.redirect(foundCountry.url);
        } else {
          country.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(country.url);
          });
        }
      });
    }
  },
];

exports.country_update_get = (req, res, next) => {
  async.parallel(
    {
      country(callback) {
        Country.findById(req.params.id).populate('country').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.country == null) {
        const err = new Error('Country not found');
        err.status = 404;
        return next(err);
      }
      res.render('country_form', {
        title: 'Update Country',
        countries: results.country,
      });
    },
  );
};

exports.country_update_post = [
  body('name', 'Country name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const country = new Country({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render('country_form', {
        title: 'Update Country',
        country,
        errors: errors.array(),
      });
    } else {
      Country.findByIdAndUpdate(req.params.id, country, {}, (err, thecountry) => {
        if (err) {
          return next(err);
        }
        res.redirect(`/countries/${thecountry.url}`);
      });
    }
  },
];

exports.country_delete_get = (req, res, next) => {
  async.parallel(
    {
      country(callback) {
        Country.findById(req.params.id).exec(callback);
      },
      countries_sandwiches(callback) {
        Sandwich.find({ country: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.country == null) {
        res.redirect('/countries/');
      }
      res.render('country_delete', {
        title: 'Delete country',
        country: results.country,
        country_sandwiches: results.countries_sandwiches,
      });
    },
  );
};

exports.country_delete_post = (req, res, next) => {
  async.parallel(
    {
      country(callback) {
        Country.findById(req.body.countryid).exec(callback);
      },
      countries_sandwiches(callback) {
        Sandwich.find({ country: req.body.countryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.countries_sandwiches.length > 0) {
        res.render('country_delete', {
          title: 'Delete country',
          country: results.country,
          country_sandwiches: results.countries_sandwiches,
        });
      } else {
        Country.findByIdAndRemove(req.body.countryid, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/countries/');
        });
      }
    },
  );
};
