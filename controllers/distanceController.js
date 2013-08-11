/**
 * Created with JetBrains WebStorm.
 * User: Dan
 * Date: 6/15/13
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
var _ = require("underscore");

module.exports.calculateDistances = function (rows, uLat, uLng, latParam, lngParam, locationName) {
    _.each(rows, function(element, index){
        var distance = module.exports.calculateDistance(element[latParam], element[lngParam], uLat, uLng);
        element.distance = distance;
        element.locationName = locationName ? locationName : 'your home location';
    })

    rows = _.filter(rows, function(row){
        return row.distance != null
    });

    rows = _.sortBy(rows, function(element){return parseFloat(element.distance)});

    rows = _.first(rows, 20);

    return rows;
}

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