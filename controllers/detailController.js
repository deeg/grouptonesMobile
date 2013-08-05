var _ = require("underscore");

module.exports.artistDetail = function (req, res, connection) {
    //Get the artist profile
    connection.query('SELECT * from artists_profile where id = "' + req.params.id + '"', function(err, rows) {
        //Get genre types
        connection.query('SELECT * from artists_ltp', function(errr, rowss){
            if (err) console.error(errr);
            var genereIdToNameMap = {}

            _.each(rowss, function(element, index){
                genereIdToNameMap[element.id] = element.genre;
            })
           //Get artists like to play
            connection.query('SELECT * from artists_profileltp_join where ?', {"profile_id": rows[0]["id"]}, function(error, ltpRows){
                if (err) console.error(err);
                if (error) console.error(error);
                var likesToPlayData = [];
                _.each(ltpRows, function(element, index){
                    var likesToPlayEntry = {
                        genre:genereIdToNameMap[element['genre_id']],
                        details:element['details']
                    }
                    likesToPlayData.push(likesToPlayEntry)
                })
                console.log(likesToPlayData)

                res.render('musicianDetail.dust', {item : rows, likesToPlayData:likesToPlayData, currentUser: req.user[0]});
            })
        });
    })
}


