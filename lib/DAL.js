var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'ns35.etcserver.com',
    user     : 'colinuli_test',
    password : 's94927ki',
    database : 'colinuli_testtones'
});

module.exports.pool = pool;

var makeQuery  = function(options, callback) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(options.query, options.escapedValues, function(err, rows) {
            // And done with the connection.
            connection.end();
            if (err) {
               return callback(err, null)
            }
            return callback(null, rows);
        });
    });
};

module.exports.makeQuery = makeQuery;