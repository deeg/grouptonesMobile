/**
 * Changing the name of this file to DAL-dev.js so it will not overwrite the DAL files on the server.
 * The DB is not open to internet, so must be on dev box for testing.
 *
 * @type {*}
 */

var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'dev',
    password : 'xxxxxxx',
    database : 'dev'
});

module.exports.pool = pool;

var makeQuery  = function(options, callback) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(options.query, options.escapedValues, function(err, rows) {
            // And done with the connection.
            if(connection) connection.release();
            if (err) {
               console.log(err);
               return callback(err, []);
            }
            return callback(null, rows);
        });
    });
};

module.exports.makeQuery = makeQuery;