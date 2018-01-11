var mongoose = require('mongoose');

var PartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  ticketSale: {
    sales: [{
      startTime: { type: Date },
      endTime: { type: Date },
      locations: { type: [String] },
      info: { type: String }
    }],
    note: { type: String }
  },
  cffc: { type: String },
  cffcImage: { type: String}
});

module.exports = mongoose.model('Party', PartySchema);
