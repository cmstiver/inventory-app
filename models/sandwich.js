/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SandwichSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  price: { type: Number, required: true },
  country: { type: Schema.ObjectId, ref: 'Country' },
  image: { type: String, required: true },
});

SandwichSchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model('Sandwich', SandwichSchema);
