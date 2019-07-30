var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'vsaveuser',
    password : 'kerala@123',
    database : 'vsavedb'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
