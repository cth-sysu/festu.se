var express = require('express');

var mongoose = require('mongoose');

var Party = require('./models/parties');
var Member = require('./models/members');
var StaticString = require('./models/string');

var router = express.Router();

router.route('/parties')
  .get()
  .put()  
  .post()
  .delete();

router.get('/parties/next')

// ?year=2015
router.route('/members')
  .get(function(req, res, next){
    Member.find()
    .select('-_id -__v')
    .exec().then(function(members){
      res.json(members);
    }, next)
  })
  .put()
  .post()
  .delete();

router.get('/members/current', function(req, res, next){
  var now = new Date();
  var year = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
  Member.find({ year })
  .select('-_id -__v -mail -address')
  .exec().then(function(members){
    res.json(members);
  }, next)

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
  .post(function(req, res, next) {
    var key = req.params.key;
    var value = req.body.value;
    if (!value) return res.status(400).end();
    new StaticString({ key, value })
    .save().then(function(val) {
      res.json({ value: val.value });
    }, next);
  })
  .delete(function(req, res, next) {
    var key = req.params.key;
    StaticString.findOneAndRemove({ key })
    .exec(function(val) {
      res.end();
    }, next);
  });

module.exports = router;