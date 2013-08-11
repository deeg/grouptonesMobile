//setup Dependencies
var express = require('express'),
    port = (process.env.PORT || 4006),
    server = express();

var dust = require('dustjs-linkedin'),
    helpers = require('dustjs-helpers'),
    cons = require('consolidate');

require('./lib/dustHelpers');

var mysql = require('mysql');
var crypto = require('crypto');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

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

var pool  = mysql.createPool({
    host     : 'ns35.etcserver.com',
    user     : 'colinuli_test',
    password : 's94927ki',
    database : 'colinuli_testtones'
});


require('./lib/passport')(pool, crypto);
require('./lib/routes')(server, passport, pool, crypto);

server.listen(port);
console.log('Listening on localhost:' + port );
