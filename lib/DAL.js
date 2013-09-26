var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'ns35.etcserver.com',
    user     : 'colinuli_gtones',
    password : 'f0rt51f5ie86d',
    database : 'colinuli_grouptones'
});

module.exports.pool = pool;

var makeQuery  = function(options, callback) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(options.query, options.escapedValues, function(err, rows) {
            // And done with the connection.
            if(connection) connection.release();
            if (err) {
               return callback(err, null)
            }
            return callback(null, rows);
        });
    });
};

module.exports.makeQuery = makeQuery;