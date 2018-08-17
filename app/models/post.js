var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  mail: { type: String, required: true },
  description : { type : String, required: true},
  order: { type: Number}
});

module.exports = mongoose.model('Post', PostSchema);