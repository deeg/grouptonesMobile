var register = require('../controllers/register');
var profileController = require('../controllers/profileController');
var detailController = require('../controllers/detailController');

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

    server.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }),
        function (req, res) {
            res.redirect('/');
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
        connection.query('SELECT * from artists_profile where id=' + req.user[0].id, function(err, rows){
            if (err) console.error(err);
            res.render('profile.dust', {user: rows[0], currentUser: req.user[0]});
        })
    })

    server.post('/profile/:id', ensureAuthenticated, function(req, res){
        console.log('posting profile');
        profileController.saveProfile(req, res, connection);
    })

    //END Profile View/Edit Routes

    //Start List/Detail views


	server.get('/events', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from events where event_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
		res.render('eventsList.dust', {list : rows, currentUser: req.user[0]});
		});
	});

    server.get('/events/:id', ensureAuthenticated, function (req, res) {
        connection.query('SELECT * from events where id = "' + req.params.id + '"', function(err, rows) {
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
		connection.query('SELECT * from projects where proj_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
			res.render('projectList.dust', {list : rows, currentUser: req.user[0]});
		});
	});

	server.get('/projects/:id', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from projects where id = "' + req.params.id + '"', function(err, rows) {
			res.render('projectDetail.dust', {item : rows, currentUser: req.user[0]});
		});
	});

    //End List/Detail views


    //Middleware to make sure request is authenticated.
    //Redirects to login page, if not authenticated
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
};