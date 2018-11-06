// Core
const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const http      = require('http');
const fs        = require('fs');
const request = require('request-promise-native');

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Models
const Party   = require('./models/parties');
const Member  = require('./models/members');
const Post    = require('./models/post');

// Auth functions
function auth(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  if (req.user) {
    next();
  } else {
    next('route');
  }
}
function token(req, res, next) {
  if (req.get('Authorization') === process.env.SECRET) {
    next();
  } else {
    next('route');
  }
}

// API Routes

router.route('/cffc')
  .get((req, res, next) => {
    const url = decodeURIComponent(req.query.url);
    request(url).then(html => {
      html = html.substring(html.indexOf('<ul class="photos">') + 19);
      html = html.substring(0, html.indexOf('</ul>'));
      const images = html.match(/http:\/\/cffc.se\/thumbnail\/thumb\/\d+\/small\.jpg/g);
      res.json({ images });
    })
    .catch(() => res.status(404).end());
  });

router.route('/parties')
  .get((req, res, next) => {
    const cffc = (req.query.cffc === 'true');
    Party.find(cffc ? { cffc: { $exists: true }} : {})
    .sort('-date')
    .exec().then(parties => res.json(parties))
    .catch(err => next(err));
  });

router.route('/parties/next')
  .get(function(req, res, next) {
    Party.findOne({ date: { $gt: new Date() }})
    .sort('date')
    .exec().then(function(party) {
      res.json(party);
    }, next);
  });

router.route('/parties/:id')
  .get((req, res, next) => {
    Party.findById(req.params.id).exec()
    .then(party => {
      if (!party) {
        return res.status(404).end();
      }
      res.json(party);
    })
    .catch(err => next(err));
  })
  .put(auth, (req, res, next) => {
    Party.findByIdAndUpdate(req.params.id, req.body).exec().then(party => {
      if (req.body.image) {
        const filename = `static/images/parties/${party.id}.jpg`;
        request(req.body.image).pipe(fs.createWriteStream(filename));
      }
      res.end();
    })
    .catch(err => next(err));
  })
  .delete(auth, (req, res, next) => {
    Party.findByIdAndRemove(req.params.id).exec().then(party => {
      res.end();
    })
    .catch(err => next(err));
  });

router.route('/parties/:id/poster')
  .put(auth, upload.single('poster'), (req, res, next) => {
    if (!req.file) {
      return res.status(400).end();
    }
    const filename = `static/images/parties/${req.params.id}_small.jpg`;
    fs.rename(req.file.path, filename, err => err ? next(err) : res.end());
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
  });

router.route('/members/current')
  .get(function(req, res, next){
    var now = new Date();
    var year = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
    Member.find({ year })
    .select('-__v -mail -address')
    .populate('post')
    .exec().then(function(members) {
      members.sort((lhs, rhs) => lhs.post.order - rhs.post.order);
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

router.route('/members/:id')
  .get(auth, (req, res, next) => {
    Member.findById(req.params.id).exec()
    .then(member => {
      if (!member) {
        return res.status(404).end();
      }
      res.json(member);
    })
    .catch(err => next(err));
  })
  .put(auth, (req, res, next) => {
    Member.findByIdAndUpdate(req.params.id, req.body).exec()
    .then(() => res.end())
    .catch(err => next(err));
  })
  .delete(auth, (req, res, next) => {
    Member.findByIdAndRemove(req.params.id).exec()
    .then(() => res.end())
    .catch(err => next(err));
  });

router.route('/members/:id/image')
  .put(auth, upload.single('image'), (req, res, next) => {
    if (!req.file) {
      return res.status(400).end();
    }
    const filename = `static/images/members/${req.params.id}.jpg`;
    fs.rename(req.file.path, filename, err => err ? next(err) : res.end());
  });

router.use((req, res) => res.status(404).end());

module.exports = router;
