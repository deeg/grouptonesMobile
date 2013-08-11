var register = require('../controllers/register');
var profileController = require('../controllers/profileController');
var detailController = require('../controllers/detailController');
var searchController = require('../controllers/searchController');
var distanceController = require('../controllers/distanceController');
var contactUsController = require('../controllers/contactUsController');

module.exports = function (server, passport, connection, crypto) {

    //Start HOMEPAGE

	server.get('/', function (req, res){
		var currentUser = {};
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
                return res.render('login.dust', {IncorrectPassword: info.message}); }
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
        register.registerArtist(req, res, connection, crypto);
    });

    server.get('/verifyEmailFree', function (req, res){
       register.verifyEmailFree(req, res, connection);
    });

    //End Register Section Routes

    //Start Profile View/Edit Routes

    server.get('/profile', ensureAuthenticated, function(req, res){
        profileController.getProfileDetails(req, res, connection);
    });

    server.post('/profile/:id', ensureAuthenticated, function(req, res){
        console.log('posting profile');
        profileController.saveProfile(req, res, connection);
    })

    //END Profile View/Edit Routes

    //START MISC

    server.get('/faq', function(req, res){
        res.render('faq.dust');
    })

    server.get('/contact', function(req, res){
        res.render('contact.dust');
    })

    server.post('/contact', function(req, res){
        contactUsController.sendEmail(req, res, connection);
    })

    //END MISC

    //Start List/Detail views


	server.get('/events', ensureAuthenticated, function (req, res) {
        searchController.search(req, res, connection, 'events');
	});

    server.get('/events/:id', ensureAuthenticated, function (req, res) {
        connection.query('SELECT e.*, a.artist_name from events e JOIN artists_profile a ON e.artist_id = a.id where e.id = "' + req.params.id + '"', function(err, rows) {
            res.render('eventDetail.dust', {item : rows, currentUser: req.user[0]});
        });
    });

	server.get('/musicians', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from artists_profile where artist_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
			res.render('musicianList.dust', {list : rows, currentUser: req.user[0]});
		});
	});

    server.get('/musicians/:id', ensureAuthenticated, function (req, res) {
        detailController.artistDetail(req, res, connection);
    });

	server.get('/projects', ensureAuthenticated, function (req, res) {
        searchController.search(req, res, connection, 'projects');
	});

	server.get('/projects/:id', ensureAuthenticated, function (req, res) {
		connection.query('SELECT p.*, a.artist_name from projects p JOIN artists_profile a ON p.artist_id = a.id where p.id = "' + req.params.id + '"', function(err, rows) {
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
        console.log(req.body);
        var dateNow =  Math.floor(new Date().getTime() / 1000);

        connection.query('INSERT INTO mail_messages (from_id, to_id, msg_subject, msg_body, sent_date) VALUES (?, ?, ?, ?, ?)', [req.user[0].id, req.body.toId, req.body.Subject, req.body.MessageBody, dateNow], function (err, results) {
            console.log(results);
            res.send(200);
        });
    });
    //END SEND MESSAGE


    //Middleware to make sure request is authenticated.
    //Redirects to login page, if not authenticated
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
};