module.exports.saveProfile = function (req, res, connection) {
    var id = req.param('id');

    console.log(req.body);

    connection.query('UPDATE artists_profile SET ? WHERE id = ' + id, req.body, function(err, rows){
        if(!err){
            if(rows.length){
                res.json(200);
            }else{
                res.json(500);
            }
        }else{
            res.json(500);
        }
    });
}


