const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const expressJwt = require('express-jwt');
const helmet = require('helmet');
const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

// Express and DB
const app = express();
const db = require('./config/db');
mongoose.Promise = global.Promise;
mongoose.connect(db);

// Helmet for secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com', 'use.fontawesome.com', "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", 'http://cffc.se'],
      fontSrc: ["'self'", 'data:', 'fonts.googleapis.com', 'fonts.gstatic.com', 'use.fontawesome.com'],
      frameSrc: ["'self'", 'www.facebook.com']
    }
  }
}));

// Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.set('trust proxy', 1);

app.use(expressJwt({
  secret: process.env.SESSION_SECRET,
  credentialsRequired: false,
  getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.signedCookies && req.signedCookies.token) {
      return req.signedCookies.token;
    }
    return null;
  }
}));

// Auth
app.route('/login')
  .get((req, res, next) => res.sendFile(path.join(__dirname, '/static/beta', 'login.html')))
  .post((req, res, next) => {
    if (req.body.username == process.env.ORV_USERNAME &&
        req.body.password == process.env.ORV_PASSWORD) {
      res.cookie('token', jwt.sign(true, process.env.SESSION_SECRET), {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        signed: true
      });
      res.redirect('/orv');
    } else {
      res.redirect('/login?error');
    }
  });

app.get('/logout', function(req, res) {
  res.clearCookie('token');
  res.redirect('/');
});

function auth(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// API
const api = require('./app/api');
app.use('/api', api);

// Static
app.use(express.static(__dirname + '/static/misc'));
app.use(express.static(__dirname + '/static/beta'));

app.use('/images', express.static(__dirname + '/static/images'), function(req, res, next) {
  res.status(404).end();
});

// Routes
app.get('/orv*', auth, function(req, res) {
  res.sendFile(path.join(__dirname, '/static/beta', 'admin.html'));
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/beta', 'index.html'));
});

http.createServer(app).listen(5000, 'localhost');
