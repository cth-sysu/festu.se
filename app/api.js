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

function token(req, res, next) {
  if (req.get('Authorization') === process.env.SECRET)
    return next();
  next('route');
}

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
