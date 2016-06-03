var express         = require('express');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session')
var passport        = require('passport');
var path            = require('path');
var helmet          = require('helmet');
var mongoose        = require('mongoose');

var http    		= require('http');
var https   		= require('https');

/* Express App */
var app = express();

var db = require('./config/db');
mongoose.connect(db);

// Helmet
app.use(helmet());

// Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.STRECKUSECRET));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(email, password, callback) {
    callback(null, email == process.env.ADMIN_USER &&
      password == process.env.ADMIN_PWD);
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// API
var api = require('./app/api');
app.use('/api', api);


// Auth
app.route('/login')
  .get(function(req, res, next){
    res.sendFile(path.join(__dirname, '/static/public', 'login.html'));
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login?error',
    successRedirect: '/admin'
  }));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
function auth(req, res, next) {
  // if (req.isAuthenticated())
    return next();
  next('route');
}

// Static
app.use(express.static(__dirname + '/static/public', { index: false }));
app.use('/admin', auth, express.static(__dirname + '/static/admin', { index: false }));

app.use('/images',
  express.static(__dirname + '/static/images', { index: false }),
  function(req, res, next) {
    res.status(404).end();
  });

// Routes
app.get('/admin*', auth, function(req, res) {
  res.sendFile(path.join(__dirname, '/static/admin', 'index.html'));
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/public', 'index.html'));
});

// http.createServer(express().use('*', function(req, res){
//     res.redirect(`https://${req.hostname}${req.originalUrl}`);
// })).listen(3000);
http.createServer(app).listen(5000);

// TODO: SSL
// var options = {
//     key: fs.readFileSync('config/privkey.pem'),
//     cert: fs.readFileSync('config/fullchain.pem')
// };
//var server = https.createServer(options, app).listen(443);