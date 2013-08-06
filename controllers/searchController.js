var _ = require("underscore");
var distanceController = require('../controllers/distanceController');

module.exports.search = function (req, res, connection, searchType) {
    var uLat = req.user[0].artist_lat
    var uLng = req.user[0].artist_lng

    var nLat = uLat - 5;
    var pLat = uLat + 5;
    var nLng = uLng - 5;
    var pLng = uLng + 5;

    var tableName, paramPrefix, templateToRender;

    if (searchType === 'projects') {
        tableName = 'projects';
        paramPrefix = 'proj';
        templateToRender = 'projectList.dust';
    }
    if (searchType === 'events') {
        tableName = 'events';
        paramPrefix = 'event';
        templateToRender = 'eventsList.dust';
    }

   // var queryString = 'SELECT * FROM ' + tableName + ' where ' + paramPrefix + '_lat between ? and ? and ' + paramPrefix + '_lng between ? and ?';
   // console.log(queryString)

    connection.query( 'SELECT p.*, a.artist_name FROM ' + tableName + ' p JOIN artists_profile a ON p.artist_id = a.id', function(err, rows){
    //where ' + paramPrefix + '_lat between ? and ? and ' + paramPrefix + '_lng between ? and ?', [nLat, pLat, nLng, pLng],  function(err, rows) {
        if(err) console.error(err);
        console.log(rows.length);
        console.log(rows[0]);
        if(rows.length < 1){
            connection.query("SELECT * from " + tableName + " where " + paramPrefix + "_state=?", req.user[0].artist_state, function(error, rowss){
                if(error) console.error(error);
                if(rowss.length < 1){
                    connection.query("SELECT * from " + tableName + " limit 10", function(errorr, rowsss){
                        //No events near lat/lng or in state
                        rows = distanceController.calculateDistances(rows, uLat, uLng);
                        res.render(templateToRender, {list: rowsss, currentUser: req.user[0]});
                        console.log("rendering generic list");
                    })
                }
                //No events in lat lng area, fall back to state
                rows = distanceController.calculateDistances(rows, uLat, uLng);
                res.render(templateToRender, {list: rowss, currentUser: req.user[0]});
                console.log("rendering state results")
            })
        }
        console.log("rendering lat/lng results")
        rows = distanceController.calculateDistances(rows, uLat, uLng, paramPrefix + '_lat', paramPrefix + '_lng');

        res.render(templateToRender, {list : rows, currentUser: req.user[0]});
    });
}

