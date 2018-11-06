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

mongoose.Promise = global.Promise;
mongoose.connect(require('./config/db'));

const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.set('trust proxy', 1);

const tokenSecret = process.env.SESSION_SECRET;
const tokenOptions = {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  signed: true
};

app.use(expressJwt({
  secret: tokenSecret,
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

app.route('/login')
  .get((req, res) => res.sendFile(path.join(__dirname, '/static/beta', 'login.html')))
  .post((req, res) => {
    if (req.body.username == process.env.ORV_USERNAME &&
        req.body.password == process.env.ORV_PASSWORD) {
      res.cookie('token', jwt.sign(true, tokenSecret), tokenOptions).redirect('/orv');
    } else {
      res.redirect('/login?error');
    }
  });

app.get('/logout', (req, res) => res.clearCookie('token').redirect('/'));

app.use('/api', require('./app/api'));

app.use(express.static(__dirname + '/static/misc'));
app.use(express.static(__dirname + '/static/beta'));

app.use('/images', express.static(__dirname + '/static/images', { fallthrough: false }));

app.get('/orv*',
  (req, res, next) => req.user ? next() : res.redirect('/login'),
  (req, res) => res.sendFile(path.join(__dirname, 'static', 'beta', 'admin.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'static', 'beta', 'index.html')));

http.createServer(app).listen(5000, 'localhost');
