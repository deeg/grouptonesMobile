/**
 * Created with JetBrains WebStorm.
 * User: Dan
 * Date: 6/15/13
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
var _ = require("underscore");
var dateConverter = require('../lib/phpToJsDate');

module.exports.calculateDistances = function (rows, start, uLat, uLng, latParam, lngParam, locationName) {
    _.each(rows, function(element, index){
        var distance = module.exports.calculateDistance(element[latParam], element[lngParam], uLat, uLng);
        element.distance = distance;
        element.locationName = locationName ? locationName : 'your home location';
    });

    rows = _.filter(rows, function(row){
        return row.distance != null
    });

    //TODO: Move this logic into a better place
    if(rows[0] && rows[0].event_start){
            //Change all dates into JS dates.
             rows = _.map(rows, function(row){
                row.event_start_formatted = dateConverter.date('F j, Y, g:i a', row.event_start);
                return row;
             });
             //Filter out all past events
             rows = _.filter(rows, function(row){
                return new Date(row.event_start_formatted) >= new Date();
             });
        //Filter by start date for events
        rows = _.sortBy(rows, function(element){ return element.event_start });
    } else {
        //Not events, filter by distance not date
        rows = _.sortBy(rows, function(element){ return parseFloat(element.distance) });
    }



    var end = start + 20;
    rows = rows.slice(start, end);

    return rows;
};

module.exports.calculateDistance = function (lat2, lon2, uLat, uLng) {
    if(lat2 == null || lon2 == null || uLat == null || uLng == null){
        //Return null distance because they are missing Lat/Lng params
        return null;
    }
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);
    uLat = parseFloat(uLat);
    uLng = parseFloat(uLng);
    var toRad = function(Value) {
        /** Converts numeric degrees to radians */
        return Value * Math.PI / 180;
    }

    var R = 6371; // km
    var dLat = toRad(lat2-uLat)
    var dLon = toRad(lon2-uLng);
    var lat1 = toRad(uLat);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var result = ((R * c) / 1.609344).toFixed(2);
    //Trim result to 2 decimal places
    return result
}