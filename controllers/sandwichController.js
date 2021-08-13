const async = require('async');
const { body, validationResult } = require('express-validator');

const Sandwich = require('../models/sandwich');
const Country = require('../models/country');

exports.sandwich_list = (req, res, next) => {
  Sandwich.find({}, 'name price image')
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
        Sandwich.findById(req.params.id).populate('country').exec(callback);
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
        sandwich: results.sandwich,
      });
    },
  );
};

exports.sandwich_create_get = (req, res, next) => {
  async.parallel(
    {
      countries(callback) {
        Country.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('sandwich_form', {
        title: 'Create Sandwich',
        countries: results.countries,
      });
    },
  );
};

exports.sandwich_create_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('country.*').escape(),
  body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('image', 'Image must not be empty.').isURL().withMessage('Image URL must be a valid URL.'),

  (req, res, next) => {
    const errors = validationResult(req);

    const sandwich = new Sandwich({
      name: req.body.name,
      description: req.body.description,
      country: req.body.country,
      price: req.body.price,
      image: req.body.image,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          countries(callback) {
            Country.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render('sandwich_form', {
            title: 'Create Sandwich',
            countries: results.countries,
            sandwich,
            errors: errors.array(),
          });
        },
      );
    } else {
      sandwich.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(sandwich.url);
      });
    }
  },
];

exports.sandwich_update_get = (req, res, next) => {
  async.parallel(
    {
      sandwich(callback) {
        Sandwich.findById(req.params.id).populate('sandwich').populate('country').exec(callback);
      },
      countries(callback) {
        Country.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.sandwich == null) {
        const err = new Error('Sandwich not found');
        err.status = 404;
        return next(err);
      }
      res.render('sandwich_form', {
        title: 'Update sandwich',
        countries: results.countries,
        sandwich: results.sandwich,
      });
    },
  );
};

exports.sandwich_update_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('country.*').escape(),
  body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('image', 'Image must not be empty.').isURL().withMessage('Image URL must be a valid URL.'),

  (req, res, next) => {
    const errors = validationResult(req);

    const sandwich = new Sandwich({
      name: req.body.name,
      description: req.body.description,
      country: req.body.country,
      price: req.body.price,
      image: req.body.image,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          countries(callback) {
            Country.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render('sandwich_form', {
            title: 'Update Sandwich',
            countries: results.countries,
            sandwich,
            errors: errors.array(),
          });
        },
      );
    } else {
      Sandwich.findByIdAndUpdate(req.params.id, sandwich, {}, (err, thesandwich) => {
        if (err) {
          return next(err);
        }
        res.redirect(`/sandwiches/${thesandwich.url}`);
      });
    }
  },
];

exports.sandwich_delete_get = (req, res, next) => {
  async.parallel(
    {
      sandwich(callback) {
        Sandwich.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.sandwich == null) {
        res.redirect('/sandwiches/');
      }
      res.render('sandwich_delete', {
        title: 'Delete sandwich',
        sandwich: results.sandwich,
      });
    },
  );
};

exports.sandwich_delete_post = (req, res, next) => {
  async.parallel(
    {
      sandwich(callback) {
        Sandwich.findById(req.body.sandwichid).exec(callback);
      },
    },
    (err) => {
      if (err) {
        return next(err);
      }
      Sandwich.findByIdAndRemove(req.body.sandwichid, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/sandwiches/');
      });
    },
  );
};
