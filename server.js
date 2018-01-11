var express         = require('express');
var http    		= require('http');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session')
var passport        = require('passport');
var path            = require('path');
var helmet          = require('helmet');
var mongoose        = require('mongoose');

// Express and DB
var app = express();
var db = require('./config/db');
mongoose.connect(db);

// Helmet for secure HTTP headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com', "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com;']
    }
}))

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
    callback(null, email == process.env.ORV_USERNAME && password == process.env.ORV_PASSWORD);
}));
passport.serializeUser(function(user, done) {
	done(null, user);
	});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

// Auth
app.route('/login')
    .get(function(req, res, next){
	    res.sendFile(path.join(__dirname, '/static/public', 'login.html'));
	})
   .post(passport.authenticate('local', {
	failureRedirect: '/login?error',
     successRedirect: '/orv'
   }));
app.get('/logout', function(req, res){
	req.logout();
    res.redirect('/');
});

function auth(req, res, next) {
    if (req.isAuthenticated()){
    	return next();
    } else {
    	res.redirect("/login");
    }
}

// API
var api = require('./app/api');
app.use('/api', api);

// Static
app.use(express.static(__dirname + '/static/public', { index: false }));
app.use('/orv', auth, express.static(__dirname + '/static/orv', { index: false }));

app.use('/images',
  express.static(__dirname + '/static/images', { index: false }),
  function(req, res, next) {
    res.status(404).end();
  });

// Routes
app.get('/orv*', auth, function(req, res) {
	res.sendFile(path.join(__dirname, '/static/orv', 'index.html'));
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/public', 'index.html'));
});

http.createServer(app).listen(5000, 'localhost');
