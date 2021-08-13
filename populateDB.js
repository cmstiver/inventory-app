require('dotenv').config();
const async = require('async');
const mongoose = require('mongoose');
const Sandwich = require('./models/sandwich');
const Country = require('./models/country');

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sandwiches = [];
const countries = [];

function countryCreate(name, cb) {
  const country = new Country({ name });

  country.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New country: ${country}`);
    countries.push(country);
    cb(null, country);
  });
}

function sandwichCreate(name, description, price, country, image, cb) {
  const sandwich = new Sandwich({
    name,
    description,
    price,
    country,
    image,
  });
  sandwich.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Sandwich: ${sandwich}`);
    sandwiches.push(sandwich);
    cb(null, sandwich);
  });
}

function createcountries(cb) {
  async.series(
    [
      (callback) => {
        countryCreate('America', callback);
      },
      (callback) => {
        countryCreate('France', callback);
      },
      (callback) => {
        countryCreate('Mexico', callback);
      },
      (callback) => {
        countryCreate('Portugal', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function createSandwiches(cb) {
  async.parallel(
    [
      (callback) => {
        sandwichCreate(
          'BLT',
          'Crispy, crunchy and salty bacon, fresh, slightly acidic tomatoes, chilled lettuce, mayonnaise, and toast. Lovely simplicity.',
          '9.99',
          countries[0],
          'https://i.imgur.com/ctdRCSG.jpeg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Reuban',
          'Reuben is a melty sandwich consisting of a combination of corned beef, rye bread, sauerkraut, Russian dressing, and Swiss cheese.',
          '10.99',
          countries[0],
          'https://i.imgur.com/c4Mms1g.jpeg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Croque-monsieur',
          'This classic French hot sandwich consists of a thin slice of ham and melted cheese tucked between two pieces of sliced bread.',
          '8.99',
          countries[1],
          'https://i.imgur.com/TefAZKN.jpeg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Philly Cheesesteak',
          'An extremely popular sandwich consisting of thinly sliced pieces of steak and tender, melting cheese in a long and crusty hoagie roll.',
          '9.99',
          countries[0],
          'https://i.imgur.com/6m7ZG3R.jpeg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Club Sandwich',
          'A true American icon, club sandwich consists of bacon, cooked chicken breast, tomatoes, and lettuce sandwiched between a few slices of toasted bread with mayonnaise.',
          '8.99',
          countries[0],
          'https://i.imgur.com/OyNjnqb.jpeg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Mollete',
          'Mollete is a traditional sandwich from northern Mexico consisting of a halved bolillo bread roll that is topped with refried beans, cheese, and tomato salsa.',
          '8.99',
          countries[2],
          'https://www.mexicanplease.com/wp-content/uploads/2018/02/molletes-bread-rolls-with-beans-and-cheese-cilantro.jpg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Francesinha',
          'Francesinha is a unique sandwich consisting of toasted bread, beef or pork, sausages, ham, and cheese, while the whole combination is then doused in a rich beer-infused tomato sauce.',
          '8.99',
          countries[3],
          'https://i.imgur.com/tpujRNT.jpeg',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Jambon-beurre',
          'Although the combination of ham and butter on a baguette may seem simple, the jambon-beurre (ham-butter) sandwich is an iconic staple of Parisian gastronomy.',
          '8.99',
          countries[1],
          'https://fabriquedelices.com/wp-content/uploads/2020/10/jambon-beurre-recipe-picture-900x899.png',
          callback,
        );
      },
      (callback) => {
        sandwichCreate(
          'Cemita',
          'Cemita is a popular Mexican sandwich originating from Puebla, consisting of a fresh, sesame seed-sprinkled bun filled with tiny strands of shredded cheese, avocado slices, pickled jalapeños, papalo (herb with a unique flavor), and cutlets of meat such as pork, beef, or chicken, all fried in breadcrumbs. The sandwich can be additionally stuffed with tomatoes, lettuce, and mayonnaise.',
          '9.99',
          countries[2],
          'https://i.imgur.com/9ApNRZX.jpeg',
          callback,
        );
      },
    ],
    // optional callback
    cb,
  );
}

async.series(
  [createcountries, createSandwiches],
  // Optional callback
  (err) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    } else {
      console.log(`countries: ${countries}`);
      console.log(`SANDWICHES: ${sandwiches}`);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);
