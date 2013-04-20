//setup Dependencies
var express = require('express'),
    port = (process.env.PORT || 4002),
    server = express();

var dust = require('dustjs-linkedin'),
    cons = require('consolidate');

var mysql = require('mysql');

var crypto = require('crypto');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


var connection = mysql.createConnection({
  host     : 'ns35.etcserver.com',
  user     : 'colinuli_test',
  password : 's94927ki',
  database : 'colinuli_testtones'
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    connection.query('SELECT * from artists_profile where email = "' + username + '"', function(err, user) {
        if (err) { return done(err); }
        if (!user || !user[0]) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user[0].password !== crypto.createHash('sha256').update(password).digest('hex')) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user[0]);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  connection.query('SELECT * from artists_profile where id = "' + id + '"', function(err, user) {
    done(err, user);
  });
});

server.configure(function(){
    server.set('views', __dirname + '/static/views');
    server.set('view options', { layout: false });
    server.engine('dust', cons.dust);
    server.set('view engine', 'dust');
    server.locals({title: 'grouptones'});
    server.use(express.static(__dirname + '/static'));
    server.use(express.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: 'testing secret' }));
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(server.router);
});

server.get('/', function (req, res){
    console.log(req.user);
    var currentUser = {};
    if (req.user) {
      currentUser = req.user[0];
    }
    res.render('base.dust', currentUser);
});

server.get('/login', function (req, res) {

  res.render('login.dust');
});

server.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }),
  function (req, res) {
    res.redirect('/');
});

server.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

server.get('/events', function (req, res) {
  connection.query('SELECT * from events where event_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
    console.log(rows);
    res.render('events.dust', {events : rows});
  });
});

server.listen(port);
console.log('Listening on localhost:' + port );
