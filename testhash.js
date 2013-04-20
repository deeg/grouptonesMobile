var crypto = require('crypto');
var fs = require('fs');

var shasum = crypto.createHash('sha256');


  shasum.update('password', 'sha256');
  var d = shasum.digest('sha256');

console.log(d);