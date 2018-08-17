// Core
const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const http      = require('http');
const fs        = require('fs');

// Mail
const nodemailer        = require('nodemailer');
const sendmailTransport = require('nodemailer-sendmail-transport');
const mailTransport     = nodemailer.createTransport(sendmailTransport());

// Models
const Party   = require('./models/parties');
const Member  = require('./models/members');
const Post    = require('./models/post');

// Auth functions
function auth(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  if (req.isAuthenticated())
    return next();
  next('route');
}
function token(req, res, next) {
  if (req.get('Authorization') === process.env.SECRET)
    return next();
  next('route');
}

// API Routes
router.route('/parties')
  .get(function(req, res, next) {
    Party.find({ cffc: { $exists: true }})
    .sort('-date')
    .exec().then(function(parties){
      res.json(parties);
    }, next);
  })
  .put(auth, function(req, res, next) {
    Party.findByIdAndUpdate(req.body.party._id,
      req.body.party)
    .exec().then(function(party) {
      /* Download image from CFFC if there is a supplied URL */
      if(req.body.party.cffcImage){
        const url = "http://cffc.se/thumbnail/thumb/" + req.body.party.cffcImage.split("/")[5] + "/big.jpg";
        const fileName = "static/images/parties/" + req.body.party._id + ".jpg";
        var fileStream = fs.createWriteStream(fileName);
        var request = http.get(url, function(response) {
          response.pipe(fileStream);
        });  
      }
      res.end();
    }, next);
  })
  .post(auth, function(req, res, next) {
    var partyId;
    new Party(req.body).save().then(function(party){
      partyId = party.id;
    }).then(function(){
      if(req.body.cffcImage){
        const url = "http://cffc.se/thumbnail/thumb/" + req.body.cffcImage.split("/")[5] + "/big.jpg";
        const fileName = "static/images/parties/" + partyId + ".jpg";
        var fileStream = fs.createWriteStream(fileName);
        var request = http.get(url, function(response) {
          response.pipe(fileStream);
        });
      }
      res.end();
    }, next);
  })
  .delete()

router.route('/parties/next')
  .get(function(req, res, next) {
    Party.findOne({ date: { $gt: new Date() }})
    .sort('date')
    .exec().then(function(party) {
      res.json(party);
    }, next);
  });

router.route('/posts')
  .get(function(req, res, next) {
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
  .put(auth, function(req, res, next) {
    Member.findByIdAndUpdate(req.body.member._id,
      req.body.member)
    .exec().then(function(member) {
      res.end();
    }, next);
  })
  .post(auth, function(req, res, next) {
    new Member(req.body).save().then(res.json.bind(res), next);
  })
  .delete()

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

router.route('/members/name')
  .get(token, (req, res, next) => {
    Member.findOne({mail: req.query.mail}).populate('post').exec()
    .then(member => member || Promise.reject())
    .catch(() => res.status(404).end())
    .then(member => {
      const years = member.year
          ? Math.floor((new Date() - new Date(parseInt(member.year), 6, 1)) / 31540000000)
          : 0;
      const name = member.post ? ('x'.repeat(years) + member.post.symbol) : member.name;
      res.json({name});
    })
  });

router.post('/contact', function(req, res, next) {
  if (!req.body.mail || !req.body.message) return next(500);
  mailTransport.sendMail({
    from: {
      name: req.body.name,
      address: 'contact@festu.se'
    },
    to: 'festu@festu.se',
    subject: 'festu.se - Contact form',
    text: 'From: ' + req.body.name + ' ' + req.body.mail + '\nMessage:\n' + req.body.message
  }, function(err, info) {
    if (err) return next(err);
    res.json({ response: info.response });
  });
});

module.exports = router;
