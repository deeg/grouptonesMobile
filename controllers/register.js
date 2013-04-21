module.exports.verifyEmailFree = function (req, res, connection) {
    connection.query('SELECT * from artists_profile where email = "' + req.query.email + '"', function(err, rows){
        if(!err){
            if(rows.length){
                res.send(false);
            }else{
                res.send(true);
            }
        }
    });
}
