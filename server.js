var express         = require('express');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var passport        = require('passport');
var path            = require('path');
var helmet          = require('helmet');
var http    		= require('http');
var https   		= require('https');

var app = express();

// TODO: MongoDB
// var db = require('./config/db');

// Helmet
app.use(helmet());

// Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.STRECKUSECRET));

// ====== PUBLIC ======

app.use(express.static(__dirname + '/static/public', { index: false }));

// app.route('/login')
//     .get(auth.try('jwt', '/'), function(req, res) {
//         res.sendFile(path.join(__dirname, '/static/public', 'index.html'));
//     })
//     .post(passport.authenticate('local-user', {
//         session: false,
//         failureRedirect: '/login?error'
//     }), auth.login, function (req, res) {
//         res.redirect('/');
//     });
// app.get('/logout', auth.logout(true));
// app.get('*', passport.authenticate('jwt', {
//     session: false,
//     failureRedirect: '/login'
// }));

// ====== PRIVATE ======

// Shared static
app.use(express.static(__dirname + '/static/strecku/shared', { index: false }));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname +  '/static/public/index.html');
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