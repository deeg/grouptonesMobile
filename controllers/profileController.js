module.exports.saveProfile = function (req, res, pool) {
    var id = req.param('id');

    console.log(req.body);

    pool.getConnection(function(err, connection) {
        connection.query('UPDATE artists_languages SET ? WHERE profile_id = ' + id, {profile_id: id, language: req.body.languages}, function(err, rows){
            connection.query('UPDATE artists_profile SET ? WHERE id = ' + id, req.body, function(err, rowss){
                connection.end();
                if(!err){
                    if(rowss.length){
                        res.json(200);
                    }else{
                        res.json(500);
                    }
                }else{
                    res.json(500);
                }
            });
        });
    });
}

module.exports.getProfileDetails = function (req, res, pool){
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from artists_profile where id=' + req.user[0].id, function(err, rows){
            if (err) console.error(err);
            console.log(connection.query);
            connection.query('SELECT * from artists_languages where profile_id = ' + rows[0].id, function(err, rowss){
                console.log(rowss[0])
                if (rowss[0]) {
                    rows[0].languages = rowss[0].language;
                }
                res.render('profile.dust', {user: rows[0], currentUser: req.user[0]});
                connection.end();
            });
        });
    });
}


