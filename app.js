//setup Dependencies
var express = require('express'),
    port = (process.env.PORT || 4006),
    server = express();

var dust = require('dustjs-linkedin'),
    helpers = require('dustjs-helpers'),
    cons = require('consolidate');

require('./lib/dustHelpers');

var passport = require('passport');

server.configure(function(){
    server.set('views', __dirname + '/static/views');
    server.set('view options', { layout: false });
    server.engine('dust', cons.dust);
    server.set('view engine', 'dust');
    server.locals({title: 'grouptones'});
    server.use(express.compress());
    server.use(express.static(__dirname + '/static'));
    server.use(express.bodyParser());
    server.use(express.cookieParser());
    server.use(express.cookieSession({ secret: 'Push uffizi drive me to firenze', cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }}));
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(server.router);
});

require('./lib/passport')();
require('./lib/routes')(server);

server.listen(80);
console.log('Listening on localhost:' + 80 );
