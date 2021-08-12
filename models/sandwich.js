const mongoose = require('mongoose');

const { Schema } = mongoose;

const SandwichSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  price: { type: Number, required: true },
  category: [{ type: Schema.ObjectId, ref: 'Category' }],
});

SandwichSchema.virtual('url').get(() => `/sandwiches/${this._id}`);

module.exports = mongoose.model('Sandwich', SandwichSchema);
