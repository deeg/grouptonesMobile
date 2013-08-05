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


