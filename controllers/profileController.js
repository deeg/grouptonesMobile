var DAL = require('../lib/DAL');

module.exports.saveProfile = function (req, res) {
    var id = req.param('id');

    console.log(req.body);
    DAL.makeQuery({query: 'UPDATE artists_languages SET ? WHERE profile_id = ?', escapedValues : [{profile_id: id, language: req.body.languages}, id]}, function(err, rows){
        DAL.makeQuery({query: 'UPDATE artists_profile SET ? WHERE id = ?', escapedValues : [req.body, id]}, function(err, rowss){
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
}

module.exports.getProfileDetails = function (req, res){
    DAL.makeQuery({query: 'SELECT * from artists_profile where id = ?', escapedValues : [req.user[0].id]}, function(err, rows){
        DAL.makeQuery({query: 'SELECT * from artists_languages where profile_id = ?', escapedValues : [rows[0].id]}, function(err, rowss){
            console.log(rowss[0])
            if (rowss[0]) {
                rows[0].languages = rowss[0].language;
            }
            res.render('profile.dust', {user: rows[0], currentUser: req.user[0]});
        });
    });
}


