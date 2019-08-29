/* eslint no-unused-vars: "off" */

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv-flow');
const express = require('express');
const expressJwt = require('express-jwt');
const fs = require('fs');
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

const secret = process.env.SESSION_SECRET;
const tokenOptions = {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  signed: true
};
const authToken = expressJwt({ secret, getToken: (req) => (req.signedCookies || {}).token });

app.route('/login')
  .get((req, res) => res.sendFile(path.join(__dirname, '/static/dist', 'login.html')))
  .post((req, res) => {
    if (req.body.username == process.env.ORV_USERNAME &&
        req.body.password == process.env.ORV_PASSWORD) {
      res.cookie('token', jwt.sign(true, secret), tokenOptions).redirect('/orv');
    } else {
      res.redirect('/login?error');
    }
  });

app.get('/logout', (req, res) => res.clearCookie('token').redirect('/'));

app.use('/api', require('./app/api'));

app.use(express.static(__dirname + '/static/misc'));
app.use(express.static(__dirname + '/static/misc/secret'));
app.use('/static', express.static(__dirname + '/static/dist/static'));

app.get('/images/members/:id.:ext', (req, res, next) => {
    fs.stat(`${__dirname}/static/images/members/${req.params.id}.${req.params.ext}`, (err, stats) => {
        if (err && err.code === 'ENOENT') {
            res.sendFile(`${__dirname}/static/images/members/fallback.png`);
            return;
        }
        next();
    })
})
app.use('/images', express.static(__dirname + '/static/images', { fallthrough: false }));

app.get('/orv*',
  authToken, (req, res, next) => res.sendFile(path.join(__dirname, 'static', 'dist', 'admin.html')),
  (err, req, res, next) => res.redirect('/login'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'static', 'dist', 'index.html')));

http.createServer(app).listen(5000, 'localhost');
