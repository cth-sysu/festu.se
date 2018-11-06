const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  cffc: { type: String },
  description: { type: String},
  // todo: implement this in admin interface
  soldOut: { type: Boolean }
});

module.exports = mongoose.model('Party', PartySchema);
