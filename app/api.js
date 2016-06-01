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

// ?key=contact
router.route('/string')
  .get(function(req, res, next) {
    StaticString.findOne({ key: req.query.key})
    .select('-_id value')
    .then(function(val) {
      if (!val) return res.status(404).end();
      res.json(val);
    }, next);
  })
  .post();

module.exports = router;