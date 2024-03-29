var DAL = require('../lib/DAL');

module.exports.saveProfile = function (req, res) {
    var id = req.param('id');

    console.log(req.body);
    DAL.makeQuery({query: 'UPDATE artists_profile SET ? WHERE id = ?', escapedValues : [req.body, id]}, function(err, rows){
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
};

module.exports.getProfileDetails = function (req, res){
    DAL.makeQuery({query: 'SELECT * from artists_profile where id = ?', escapedValues : [req.user[0].id]}, function(err, rows){
        if(!err){
            res.render('profile.dust', {user: rows[0], currentUser: req.user[0]});
        }else{
            res.json(500);
        }
    });
};

module.exports.getProfileByEmail = function(username, cb){
    DAL.makeQuery({query: 'SELECT * from artists_profile where email = ?', escapedValues : [username]}, function(err, rows){
        if(!err){
            cb(null, rows);
        }else{
            cb(err);
        }
    });
};

module.exports.updatePassword = function(options, cb){
    if(options.password && options.email){
        DAL.makeQuery({query: 'UPDATE artists_profile SET password = ? WHERE email = ?', escapedValues: [options.password, options.email]}, function(err, rows){
            cb(err, rows);
        })
    }
};


