var register = require('../controllers/register');
var profileController = require('../controllers/profileController');
var detailController = require('../controllers/detailController');
var searchController = require('../controllers/searchController');
var distanceController = require('../controllers/distanceController');
var contactUsController = require('../controllers/contactUsController');
var messageController = require('../controllers/messageController');
var forgotPasswordController = require('../controllers/forgotPasswordController');

var DAL = require('../lib/DAL');
var crypto = require('crypto');
var passport = require('passport');

module.exports = function (server) {

    //Start HOMEPAGE

	server.get('/', function (req, res){
		var currentUser = {};
        var forgotPassword = req.query.fp;
        if(forgotPassword){
            return res.render('setNewPassword.dust');
        }

		if (req.user) {
		    currentUser = req.user[0];
		}
		res.render('home.dust', {currentUser: currentUser});
	});

    //End HOMEPAGE

    //Start Login/Logout

    server.get('/login', function (req, res) {
		res.render('login.dust');
	});

    server.post('/login', function (req, res) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return console.log(err); }
            if (!user) {
                console.log(info);
                return res.render('login.dust', {IncorrectPassword: info.message});
            }
            req.logIn(user, function(err) {
                //console.log(user);
                if (err) { return console.log(err); }
                return res.redirect('/');
            });
        })(req, res);
    });

    server.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    //End Login/Logout

    //Start Register Section Routes

    server.get('/register', function (req, res){
        res.render('register.dust')
    });

    server.post('/registerArtist', function(req, res){
        register.registerArtist(req, res, crypto);
    });

    server.get('/verifyEmailFree', function (req, res){
       register.verifyEmailFree(req, res);
    });

    //End Register Section Routes

    //Start Profile View/Edit Routes

    server.get('/profile', ensureAuthenticated, function(req, res){
        profileController.getProfileDetails(req, res);
    });

    server.post('/profile/:id', ensureAuthenticated, function(req, res){
        console.log('posting profile');
        profileController.saveProfile(req, res);
    });

    //END Profile View/Edit Routes

    //START MISC

    server.get('/faq', function(req, res){
        if(req.user && req.user[0]){
            res.render('faq.dust', {currentUser: req.user[0]});
        }else{
            res.render('faq.dust')
        }
    });

    server.get('/contact', function(req, res){
        if(req.user && req.user[0]){
            res.render('contact.dust', {currentUser: req.user[0]});
        }else{
            res.render('contact.dust');
        }
    });

    server.post('/contact', function(req, res){
        contactUsController.sendEmail(req, res);
    });

    //END MISC


    //Start List/Detail views
	server.get('/events', ensureAuthenticated, function (req, res) {
        searchController.search(req, res, 'events', function(results) {
            res.render('eventsList.dust', {list : results, currentUser: req.user[0]});
        });
	});

    server.get('/events/:id', ensureAuthenticated, function (req, res) {
        DAL.makeQuery({query: 'SELECT e.*, a.artist_name from events e JOIN artists_profile a ON e.artist_id = a.id where e.id = ?', escapedValues : [req.params.id]}, function(err, rows){
            res.render('eventDetail.dust', {item : rows, currentUser: req.user[0]});
        });
    });

	server.get('/musicians', ensureAuthenticated, function (req, res) {
        searchController.search(req, res, 'musicians', function(results) {
            res.render('musicianList.dust', {list : results, currentUser: req.user[0]});
        });
	});

    server.get('/musicians/:id', ensureAuthenticated, function (req, res) {
        detailController.artistDetail(req, res);
    });

	server.get('/projects', ensureAuthenticated, function (req, res) {
        searchController.search(req, res, 'projects', function(results) {
            res.render('projectList.dust', {list : results, currentUser: req.user[0]});
        });
	});

    server.get('/:type/paginate/:index', ensureAuthenticated, function(req, res) {
       searchController.search(req, res, req.params.type, function(results) {
           res.json(results);
       });
    });

	server.get('/projects/:id', ensureAuthenticated, function (req, res) {
        DAL.makeQuery({query: 'SELECT p.*, a.artist_name from projects p JOIN artists_profile a ON p.artist_id = a.id where p.id = ?', escapedValues : [req.params.id]}, function(err, rows){
            var uLat = req.user[0].artist_lat;
            var uLng = req.user[0].artist_lng;
            var commitmentMap = [
                'n/a',
                'Low',
                'Medium',
                'High'
            ];
            rows[0].proj_commitment = commitmentMap[rows[0].proj_commitment];
            console.log(rows);
            rows[0].distance = distanceController.calculateDistance(rows[0].proj_lat, rows[0].proj_lng, uLat, uLng);
            res.render('projectDetail.dust', {item : rows, currentUser: req.user[0]});
        });
	});
    //End List/Detail views


    //START SEND MESSAGE
    server.post('/Message', function (req, res) {
        var dateNow =  Math.floor(new Date().getTime() / 1000);
        DAL.makeQuery({query: 'INSERT INTO mail_messages (from_id, to_id, msg_subject, msg_body, sent_date) VALUES (?, ?, ?, ?, ?)', escapedValues : [req.user[0].id, req.body.toId, req.body.Subject, req.body.MessageBody, dateNow]}, function(err, results){
            res.send(200);
        });
    });
    //END SEND MESSAGE

    server.get('/messages', ensureAuthenticated, function (req, res) {
        messageController.list(req, res);
    });

    server.get('/messages/:id', ensureAuthenticated, function (req, res) {
        messageController.message(req, res);
    });


    //RESET PASSWORD ROUTES
    server.get('/resetPassword', function(req, res){
        res.render('resetPassword.dust');
    });

    server.post('/resetPassword', forgotPasswordController.requestPasswordReset);

    server.post('/resetPassword/:resetId', forgotPasswordController.setNewPassword);

    //Middleware to make sure request is authenticated.
    //Redirects to login page, if not authenticated
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
};