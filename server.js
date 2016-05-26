var fs              = require('fs');
var express         = require('express');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');
var passport        = require('passport');
var path            = require('path');
var helmet          = require('helmet');

var auth    = require('./app/auth');
var api     = require('./app/api');

var http    = require('http');
var https   = require('https');

var app = express();

var db = require('./config/db');
mongoose.connect(db.url);

// Start twitter component
require('./app/twitter');

// Helmet
app.use(helmet());

// Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.STRECKUSECRET));
app.use(methodOverride('X-HTTP-Method-Override'));

// Passport.js
app.use(passport.initialize({
    userProperty: 'subject'
}));

// ====== TOKEN ======

function create(req, res){
    res.sendFile(path.join(__dirname, '/static/private', 'create.html'));
}
app.get('/user', auth.token('User'), create);
app.get('/store', auth.token('Store'), create);
app.get('/activate', auth.activate);
app.get('/confirm', auth.confirm);

// ====== API ======

app.use('/api/v1', api);

// ====== PUBLIC ======

app.use(express.static(__dirname + '/static/public', { index: false }));

app.get('/forgot', auth.forgot);
app.route('/recover')
    .get(auth.token('Recover'), function(req, res) {
        res.sendFile(path.join(__dirname, '/static/public', 'recover.html'));
    })
    .post(auth.token('Recover'), auth.recover);

app.route('/login')
    .get(auth.try('jwt', '/'), function(req, res) {
        res.sendFile(path.join(__dirname, '/static/public', 'index.html'));
    })
    .post(passport.authenticate('local-user', {
        session: false,
        failureRedirect: '/login?error'
    }), auth.login, function (req, res) {
        res.redirect('/');
    });
app.get('/logout', auth.logout(true));
app.get('*', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login'
}));

// Error handling
app.use(function(err, req, res, next) {
    if (!isNaN(err))
        return res.redirect(`/login?error=${err}`);
    res.redirect(`/login?error=${err.name}`);
});

// ====== PRIVATE ======
app.use(auth.authenticate);

// Shared static
app.use(express.static(__dirname + '/static/strecku/shared', { index: false }));

// Generate token
app.get('/invite', auth.superAdmin(function(req, res, next){
    res.sendFile(path.join(__dirname, '/static/private', 'gentoken.html'));
}));

// Admin router
var admin = express.Router({ mergeParams: true });
admin.get('*', auth.subjectStoreAdmin(function(req, res) {
    res.sendFile(path.join(__dirname, '/static/strecku/admin', 'index.html'));
}));
app.use('/admin', auth.subjectAdmin,
    express.static(__dirname + '/static/strecku/admin', { index: false }));
app.use('/admin/:store_id', admin);

// Terminal router
var terminal = express.Router({ mergeParams: true });
terminal.use(express.static(__dirname + '/static/strecku/terminal', { index: false }));
terminal.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/static/strecku/terminal', 'index.html'));
});
app.use(auth.Store(terminal));

// Client router
var client = express.Router();
client.use(express.static(__dirname + '/static/strecku/client', { index: false }));
client.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/static/strecku/client', 'index.html'));
});
app.use(client);


http.createServer(express().use('*', function(req, res){
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
})).listen(80);

var options = {
    key: fs.readFileSync('config/privkey.pem'),
    cert: fs.readFileSync('config/fullchain.pem')
};
var server = https.createServer(options, app).listen(443);

// Terminal socket
require('./app/terminal')(server);