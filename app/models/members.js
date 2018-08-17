var mongoose = require('mongoose');

var MemberSchema = new mongoose.Schema({
  name        : { type: String, required:true},
  post        : { type: mongoose.Schema.ObjectId, ref: 'Post'},
  mail        : { type: String},
  phone       : { type: String},
  adress      : { type: String},
  programme   : { name: { type: String}, year: { type: Number} },
  year        : { type: Number},
  description : { type: String},
  has_image   : { type: Boolean}
});

module.exports = mongoose.model('Member', MemberSchema);