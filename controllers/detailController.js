var _ = require("underscore");
var DAL = require('../lib/DAL');

module.exports.artistDetail = function (req, res) {
    //Get the artist profile
    DAL.makeQuery({query: 'SELECT * from artists_profile where id = ?', escapedValues : [req.params.id]}, function(err, rows){
        //Get genre types
        DAL.makeQuery({query: 'SELECT * from artists_ltp', escapedValues : []}, function(errr, rowss){
            if (err) console.error(errr);
            var genereIdToNameMap = {}

            _.each(rowss, function(element, index){
                genereIdToNameMap[element.id] = element.genre;
            });

            //Get like to play
            DAL.makeQuery({query: 'SELECT * from artists_profileltp_join where ?', escapedValues : {"profile_id": rows[0]["id"]}}, function(error, ltpRows){
                if (err) console.error(err);
                if (error) console.error(error);
                var likesToPlayData = [];
                _.each(ltpRows, function(element, index){
                    var likesToPlayEntry = {
                        genre:genereIdToNameMap[element['genre_id']],
                        details:element['details']
                    };
                    likesToPlayData.push(likesToPlayEntry)
                });
                console.log(likesToPlayData);

                res.render('musicianDetail.dust', {item : rows, likesToPlayData:likesToPlayData, currentUser: req.user[0]});
            });
        });
    });
};


