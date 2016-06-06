var express = require('express');

var mongoose = require('mongoose');

var Party = require('./models/parties');
var Member = require('./models/members');
var Post = require('./models/post');
var StaticString = require('./models/string');

var http = require('http');
var fs = require('fs');
var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

var mailTransport = nodemailer.createTransport(sendmailTransport());

var router = express.Router();

function auth(req, res, next) {
  if (req.isAuthenticated())
    return next();
  next('route');
}

router.route('/parties')
  .get(auth, function(req, res, next) {
    Party.find()
    .sort('-date')
    .exec().then(res.json.bind(res), next);
  })
  .post(auth, function(req, res, next) {
    var name = req.body.name;
    var date = req.body.date;
    var ticketSaleDate = new Date(req.body.ticketSaleDate);
    var ticketSaleDate2 = new Date(ticketSaleDate.getTime() + 86400000);
    new Party({
      name, date,
      ticketSale: {
        sales: [{
          startTime: ticketSaleDate,
          endTime: new Date(ticketSaleDate.getTime() + 3600000),
          locations: [ 'Teknologgården (Johanneberg)', 'Jupiter (Lindholmen)' ],
          info: 'Chalmerist with valid student ID only\nMax 1+7 tickets/person'
        }, {
          startTime: ticketSaleDate2,
          endTime: new Date(ticketSaleDate2.getTime() + 3600000),
          locations: [ 'Teknologgården (Johanneberg)' ],
          info: 'Anyone can buy\nMax 8 tickets/person'
        }],
        note: 'Reserve for changes, >= 18 years'
      }
    })
    .save().then(function(party) {
      res.json(party);
    }, next);
  });

router.route('/parties')
  .get(function(req, res, next) {
    Party.find({ cffc: { $exists: true }})
    .sort('-date')
    .exec().then(function(parties){
      res.json(parties);
    }, next);
  });
router.route('/parties/next')
  .get(function(req, res, next) {
    Party.findOne({ date: { $gt: new Date() }})
    .sort('-date')
    .exec().then(function(party) {
      res.json(null);
    }, next);
  });

router.route('/parties/:party_id')
  .put(auth, function(req, res, next) {
    var cffc = req.body.cffc;
    var image = req.body.image;
    if (cffc && image) {
      // Download and store image file
      var file = fs.createWriteStream('./static/images/parties/' +
        req.params.party_id + '.jpg');
      var request = http.get(image, function(response) {
        response.pipe(file);
      });
    }
    Party.findByIdAndUpdate(req.params.party_id,
      { $set: { cffc } })
    .exec().then(function(party) {
      res.end();
    }, next);
  })
  .delete(auth, function(req, res, next) {
    Party.findByIdAndRemove(req.params.party_id)
    .exec().then(function(party) {
      res.end();
    }, next);
  });


// ?year=2015
router.route('/posts')
  .get(auth, function(req, res, next) {
    Post.find().exec().then(res.json.bind(res), next);
  });
router.route('/members')
  .get(auth, function(req, res, next){
    Member.find()
    .select('-__v')
    .populate({ path: 'post', select: 'symbol name' })
    .sort('-year')
    .exec().then(function(members){
      res.json(members);
    }, next)
  })
  // .put()
  .post(auth, function(req, res, next) {
    new Member(req.body).save().then(res.json.bind(res), next);
  })
  // .delete()
  ;

router.route('/members/current')
  .get(function(req, res, next){
    var now = new Date();
    var year = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
    Member.find({ year })
    .select('-__v -mail -address')
    .populate('post')
    .exec().then(function(members){
      res.json(members);
    }, next);
  });

// /api/strings/contact_info
router.route('/strings/:key')
  .get(function(req, res, next) {
    StaticString.findOne({ key: req.params.key})
    .then(function(val) {
      if (!val) return res.status(404).end();
      res.json({ value: val.value });
    }, next);
  })
  .post(auth, function(req, res, next) {
    var key = req.params.key;
    var value = req.body.value;
    if (!value) return res.status(400).end();
    StaticString.findOneAndUpdate({ key }, { key, value },
      { upsert: true, new: true })
    .exec().then(function(val) {
      res.json({ value: val.value });
    }, next);
  })
  .delete(auth, function(req, res, next) {
    var key = req.params.key;
    StaticString.findOneAndRemove({ key })
    .exec(function(val) {
      res.end();
    }, next);
  });

router.post('/contact', function(req, res, next) {
  if (!req.body.email || req.body.message) return next(500);
  // TODO: Send mail to info@festu.se
  mailTransport.sendMail({
    from: req.body.email,
    // {
    //   name: req.body.name,
    //   address: req.body.email
    // },
    to: 'angseus@festu.se',
    subject: 'Website contact form',
    text: req.body.message
  }, function(err, info) {
    if (err) return next(err);
    res.json({ response: info.response });
  });
});

module.exports = router;