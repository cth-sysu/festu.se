const express = require('express');
const expressJwt = require('express-jwt');
const fs = require('fs');
const multer = require('multer')
const request = require('request-promise-native');

const Party = require('./models/parties');
const Member = require('./models/members');
const Post = require('./models/posts');

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

const auth = expressJwt({
  secret: process.env.SESSION_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: process.env.NODE_ENV !== 'development',
  getToken(req) {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.signedCookies && req.signedCookies.token) {
      return req.signedCookies.token;
    }
    return null;
  }
});

function authOrStaticSecret(req, res, next) {
  if (req.headers.authorization && process.env.STATIC_SECRET) {
    const [type, credentials] = req.headers.authorization.split(' ');
    if (type.toLowerCase() === 'bearer' && credentials === process.env.STATIC_SECRET) {
      return next();
    }
  }
  auth(req, res, next);
};

const kNotFound = new Error('Not Found');

router.route('/cffc')
  .get((req, res, next) => {
    const url = decodeURIComponent(req.query.url);
    request(url).then(html => {
      html = html.substring(html.indexOf('<ul class="photos">') + 19);
      html = html.substring(0, html.indexOf('</ul>'));
      const images = html.match(/https:\/\/cffc.se\/thumbnail\/thumb\/\d+\/small\.jpg/g);
      res.json({ images });
    })
    .catch(() => res.status(404).end());
  });

router.route('/parties')
  .get((req, res, next) => {
    const cffc = (req.query.cffc === 'true');
    Party.find(cffc ? { cffc: { $exists: true }} : {}).sort('-date').exec()
    .then(parties => res.json(parties))
    .catch(err => next(err));
  })
  .post(auth, (req, res, next) => {
    new Party(req.body).save().then(party => res.json(party)).catch(err => next(err));
  });

router.route('/parties/next')
  .get((req, res, next) => {
    Party.findOne({ date: { $gt: new Date() }}).sort('date').exec()
    .then(party => res.json(party))
    .catch(err => next(err));
  });

router.route('/parties/:id')
  .get((req, res, next) => {
    Party.findById(req.params.id).exec()
    .then(party => party || Promise.reject(kNotFound))
    .then(party => res.json(party))
    .catch(err => next(err));
  })
  .put(auth, (req, res, next) => {
    Party.findByIdAndUpdate(req.params.id, req.body).exec()
    .then(party => party || Promise.reject(kNotFound))
    .then(party => {
        if (req.body.image) {
            const filename = `static/images/parties/${party.id}.jpg`;
            request(req.body.image).pipe(fs.createWriteStream(filename));
        }
        res.end();
    })
    .catch(err => next(err));
  })
  .delete(auth, (req, res, next) => {
    Party.findByIdAndRemove(req.params.id).exec()
    .then(party => party || Promise.reject(kNotFound))
    .then(() => res.end())
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
  .get((req, res, next) => {
    Post.find().sort('order').exec().then(posts => res.json(posts)).catch(err => next(err));
  });

router.route('/members')
  .get(auth, (req, res, next) => {
    Member.find()
    .select('-__v')
    .populate({ path: 'post', select: 'symbol name' })
    .sort('-year')
    .exec().then(members => res.json(members))
    .catch(err => next(err));
  })
  .post(auth, (req, res, next) => {
    new Member(req.body).save().then(member => res.json(member)).catch(err => next(err));
  });

router.route('/members/current')
  .get((req, res, next) =>{
    const now = new Date();
    const year = now.getFullYear() - (now.getMonth() < 6);
    Member.find({ year })
    .select('-__v -mail -address')
    .populate('post')
    .exec().then(members => {
      members.sort((lhs, rhs) => lhs.post.order - rhs.post.order);
      res.json(members);
    })
    .catch(err => next(err));
  });

router.route('/members/name')
  .get(authOrStaticSecret, (req, res, next) => {
    Member.findOne({ mail: req.query.mail }).populate('post').exec()
    .then(member => member || Promise.reject(kNotFound))
    .then(member => {
      const years = member.year
          ? Math.floor((new Date() - new Date(parseInt(member.year), 6, 1)) / 31540000000)
          : 0;
      const name = member.post ? ('x'.repeat(years) + member.post.symbol) : member.name;
      res.json({ name });
    })
    .catch(err => next(err));
  });

router.route('/members/:id')
  .get(auth, (req, res, next) => {
    Member.findById(req.params.id).exec()
    .then(member => member || Promise.reject(kNotFound))
    .then(member => res.json(member))
    .catch(err => next(err));
  })
  .put(auth, (req, res, next) => {
    Member.findByIdAndUpdate(req.params.id, req.body).exec()
    .then(member => member || Promise.reject(kNotFound))
    .then(() => res.end())
    .catch(err => next(err));
  })
  .delete(auth, (req, res, next) => {
    Member.findByIdAndRemove(req.params.id).exec()
    .then(member => member || Promise.reject(kNotFound))
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

router.use((req, res, next) => next(kNotFound));
router.use((err, req, res, next) => {
  if (err === kNotFound) {
    res.status(404).end();
  } else if (err instanceof expressJwt.UnauthorizedError) {
    res.status(401).end();
  } else {
    res.status(500).end();
  }
});

module.exports = router;
