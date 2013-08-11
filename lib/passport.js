var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(pool, crypto) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            pool.getConnection(function(err, connection) {
                connection.query('SELECT * from artists_profile where email = "' + username + '"', function(err, user) {
                    if (err) { return done(null, false, {message: "Bad Connection"}); }
                    if (!user || !user[0]) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (user[0].password !== crypto.createHash('sha256').update(password).digest('hex')) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user[0]);
                });

                connection.end();
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        pool.getConnection(function(err, connection) {
            connection.query('SELECT * from artists_profile where id = "' + id + '"', function(err, user) {
                done(err, user);
            });
            connection.end();
        });
    });
};