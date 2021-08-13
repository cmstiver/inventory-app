/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

CategorySchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
