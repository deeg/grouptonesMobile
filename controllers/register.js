module.exports.verifyEmailFree = function (req, res, connection) {
    connection.query('SELECT * from artists_profile where email = "' + req.query.email + '"', function(err, rows){
        if(!err){
            if(rows.length){
                res.json(200, {emailFree: false});
            }else{
                res.json(200, {emailFree: true});
            }
        }
    });
}

module.exports.registerArtist = function(req, res, connection, crypto) {
    var passwordHash = crypto.createHash('sha256').update(req.body.password).digest('hex');



    connection.query("INSERT INTO colinuli_testtones.artists_profile (email, password, artist_name, artist_country, artist_state, artist_zip, artist_lat, artist_lng) " +
        "VALUES ('"+req.body.email+"', '"+passwordHash+"', '"+req.body.name+"', '"+req.body.country+"', '"+req.body.state+"', '"+req.body.zip+"', '"+req.body.lat+"', '"+req.body.lng+"')", function(err, rows){
        if(!err){
           res.json(200);
        }else{
            //TODO:Handle error when inserting new user into the DB
        }
    });

}
