/**
 * Created with JetBrains WebStorm.
 * User: Dan
 * Date: 6/15/13
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
var _ = require("underscore");

module.exports.calculateDistances = function (rows, uLat, uLng, latParam, lngParam) {
    console.log(latParam)
    console.log(lngParam)
    _.each(rows, function(element, index){
        if(index == 0){console.log(element);}
        var distance = module.exports.calculateDistance(element[latParam], element[lngParam], uLat, uLng);
        element.distance = distance;
    })

    rows = _.sortBy(rows, function(element){return parseFloat(element.distance)})

    rows = _.first(rows, 20);

    console.log(rows);

    return rows;
}

module.exports.calculateDistance = function (lat2, lon2, uLat, uLng) {
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
    //Trim result to 2 decimal places
    return ((R * c) / 1.609344).toFixed(2);
}