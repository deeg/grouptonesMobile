var _ = require("underscore");
var distanceController = require('../controllers/distanceController');

module.exports.searchEvents = function (req, res, connection) {
    var uLat = req.user[0].artist_lat
    var uLng = req.user[0].artist_lng

    var nLat = uLat - 15;
    var pLat = uLat + 15;
    var nLng = uLng - 15;
    var pLng = uLng + 15;



    connection.query('SELECT * from events where event_lat between ? and ? and event_lng between ? and ?', [nLat, pLat, nLng, pLng],  function(err, rows) {
        if(err) console.error(err);
        if(rows.length < 1){
            connection.query("SELECT * from events where event_state=?", req.user[0].artist_state, function(error, rowss){
                if(error) console.error(error);
                if(rowss.length < 1){
                    connection.query("SELECT * from events limit 10", function(errorr, rowsss){
                        //No events near lat/lng or in state
                        rows = distanceController.calculateDistances(rows, uLat, uLng);
                        res.render('eventList.dust', {list: rowsss, currentUser: req.user[0]});
                        console.log("rendering generic list");
                    })
                }
                //No events in lat lng area, fall back to state
                rows = distanceController.calculateDistances(rows, uLat, uLng);
                res.render('eventList.dust', {list: rowss, currentUser: req.user[0]});
                console.log("rendering state results")
            })
        }
        console.log("rendering lat/lng results")
        rows = distanceController.calculateDistances(rows, uLat, uLng);
        if(rows.length > 20){
            rows = _.filter(rows, function(row){return row.distance < 15})
        }
        res.render('eventsList.dust', {list : rows, currentUser: req.user[0]});
    });
}
