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
    console.log(passwordHash);

    connection.query("INSERT INTO colinuli_testtones.artists_profile (email, password, artist_name) VALUES ('" + req.body.email +"', '" + passwordHash +  "', '" + req.body.name + "')", function(err, rows){
        console.log(rows);
        res.json(200, rows);
    });

}
