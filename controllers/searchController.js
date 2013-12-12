var _ = require("underscore");
var distanceController = require('../controllers/distanceController');
var DAL = require('../lib/DAL');

module.exports.search = function (req, res, searchType, done) {
    var uLat, uLng;
    if(req.query.lat && req.query.lng){
        uLat = req.query.lat;
        uLng = req.query.lng;
    }else{
        uLat = req.user[0].artist_lat;
        uLng = req.user[0].artist_lng;
    }

    if(req.query.locationName){
        var locationName = req.query.locationName;
    }

    var nLat = Math.round(parseFloat(uLat) - 5);
    var pLat = Math.round(parseFloat(uLat) + 5);
    var nLng = Math.round(parseFloat(uLng) - 5);
    var pLng = Math.round(parseFloat(uLng) + 5);

    var tableName, paramPrefix, queryString, searchTermString;

    if (searchType === 'projects') {
        tableName = 'projects';
        paramPrefix = 'proj';
        searchTermString = " AND ((proj_name  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (proj_description  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (proj_website  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR" +
            "(proj_website_url  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (a.artist_name  REGEXP '[[:<:]]{searchTerm}[[:>:]]'))";

    }
    if (searchType === 'events') {
        tableName = 'events';
        paramPrefix = 'event';
        searchTermString = " AND ((event_name  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (event_description  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (event_venue  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (a.artist_name  REGEXP '[[:<:]]{searchTerm}[[:>:]]'))"
    }
    if(searchType === 'musicians'){
        tableName = 'artists_profile';
        paramPrefix = 'artist';
        searchTermString = " AND ((artist_name  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (artist_about  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (artist_instrument  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR" +
            "(artist_band  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (artist_services  REGEXP '[[:<:]]{searchTerm}[[:>:]]') OR (artist_headline REGEXP '[[:<:]]{searchTerm}[[:>:]]'))";
        queryString = 'SELECT * FROM ' + tableName + ' where artist_lat between ' + nLat + ' and ' + pLat + ' and artist_lng between ' + nLng + ' and ' + pLng;
    }else{
        queryString = 'SELECT p.*, a.artist_name FROM ' + tableName + ' p JOIN artists_profile a ON p.artist_id = a.id where ' + paramPrefix + '_lat between ' + nLat + ' and ' + pLat + ' and ' + paramPrefix + '_lng between ' + nLng + ' and ' + pLng;
    }


    //Check if there is a search query term, if so build the search SQL string
    if(req.query.searchTerm){
        var searchTerm = req.query.searchTerm;
        searchTermString = searchTermString.replace(/{searchTerm}/g, searchTerm);
        queryString = queryString + searchTermString;
    }

    var start = 0;
    if (req.params.index) {
        start = parseInt(req.params.index, 10);
    }

    DAL.makeQuery({query: queryString, escapedValues : []}, function(err, rows){
        if(err) console.error(err);
        if(rows && rows.length < 1){
            DAL.makeQuery({query: "SELECT * from " + tableName + " where " + paramPrefix + "_state=?", escapedValues : [req.user[0].artist_state]}, function(error, rowss){
                if(rowss.length < 1){
                    DAL.makeQuery({query: "SELECT * from " + tableName + " limit 10", escapedValues : []}, function(errorr, rowsss){
                        //No events near lat/lng or in state
                        rowsss = distanceController.calculateDistances(rowsss, start, uLat, uLng, paramPrefix + '_lat', paramPrefix + '_lng', locationName);
                        done(rowsss);
                    });
                }
                //No events in lat lng area, fall back to state
                rowss = distanceController.calculateDistances(rowss, start, uLat, uLng, paramPrefix + '_lat', paramPrefix + '_lng', locationName);
                done(rowss);
            });
        }
        rows = distanceController.calculateDistances(rows, start, uLat, uLng, paramPrefix + '_lat', paramPrefix + '_lng', locationName);
        done(rows);
    });
};

