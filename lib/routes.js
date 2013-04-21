var register = require('../controllers/register');

module.exports = function (server, passport, connection, crypto) {

	server.get('/', function (req, res){
		var currentUser = {};
		if (req.user) {
		currentUser = req.user[0];
		}
		res.render('base.dust', currentUser);
	});

	server.get('/login', function (req, res) {
		res.render('login.dust');
	});


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

	server.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }),
		function (req, res) {
			res.redirect('/');
		});

	server.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	server.get('/events', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from events where event_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
		console.log(rows);
		res.render('eventsList.dust', {list : rows});
		});
	});

    server.get('/events/:id', ensureAuthenticated, function (req, res) {
        connection.query('SELECT * from events where id = "' + req.params.id + '"', function(err, rows) {
            console.log(rows);
            res.render('eventDetail.dust', {item : rows});
        });
    });

	server.get('/musicians', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from artists_profile where artist_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
			console.log(rows);
			res.render('musicianList.dust', {list : rows});
		});
	});

    server.get('/musicians/:id', ensureAuthenticated, function (req, res) {
        connection.query('SELECT * from artists_profile where id = "' + req.params.id + '"', function(err, rows) {
            console.log(rows);
            res.render('musicianDetail.dust', {item : rows});
        });
    });

	server.get('/projects', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from projects where proj_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
			console.log(rows);
			res.render('projectList.dust', {list : rows});
		});
	});

	server.get('/projects/:id', ensureAuthenticated, function (req, res) {
		connection.query('SELECT * from projects where id = "' + req.params.id + '"', function(err, rows) {
			console.log(rows);
			res.render('projectDetail.dust', {item : rows});
		});
	});


    //Middleware to make sure request is authenticated.
    //Redirects to login page, if not authenticated
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
};