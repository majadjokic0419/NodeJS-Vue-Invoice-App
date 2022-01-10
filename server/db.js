const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'invoicingapp'

});

exports.getConnection = function(callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            return callback(err);
        }
        callback(err, conn);
    });
};