module.exports.saveProfile = function (req, res, connection) {
    var id = req.param('id');

    console.log(req.body);

    connection.query('UPDATE artists_languages SET ? WHERE profile_id = ' + id, {profile_id: id, language: req.body.languages}, function(err, rows){
        connection.query('UPDATE artists_profile SET ? WHERE id = ' + id, req.body, function(err, rowss){
            if(!err){
                if(rowss.length){
                    res.json(200);
                }else{
                    res.json(500);
                }
            }else{
                res.json(500);
            }
        })
    })
}

module.exports.getProfileDetails = function (req, res, connection){
    connection.query('SELECT * from artists_profile where id=' + req.user[0].id, function(err, rows){
        if (err) console.error(err);
        connection.query('SELECT * from artists_languages where profile_id = ' + rows[0].id, function(err, rowss){
            console.log(rowss[0])
            console.log(rowss[0].language);
            rows[0].languages = rowss[0].language;
            res.render('profile.dust', {user: rows[0], currentUser: req.user[0]});
        })
    });
}


