module.exports = function (server, passport, connection) {

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
		res.render('eventsList.dust', {list : rows});
		});
	});

	server.get('/musicians', function (req, res) {
		connection.query('SELECT * from artists_profile where artist_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
			console.log(rows);
			res.render('musicianList.dust', {list : rows});
		});
	});

	server.get('/projects', function (req, res) {
		connection.query('SELECT * from projects where proj_state = "' + req.user[0].artist_state + '" limit 10', function(err, rows) {
			console.log(rows);
			res.render('projectList.dust', {list : rows});
		});
	});

	server.get('/projects/:id', function (req, res) {
		connection.query('SELECT * from projects where id = "' + req.params.id + '"', function(err, rows) {
			console.log(rows);
			res.render('projectDetail.dust', {item : rows[0]});
		});
	});	
};