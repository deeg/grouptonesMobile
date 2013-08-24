var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'ns35.etcserver.com',
    user     : 'colinuli_test',
    password : 's94927ki',
    database : 'colinuli_testtones'
});

module.exports.pool = pool;