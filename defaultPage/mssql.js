var Connection = require('tedious').Connection,
    Request = require('tedious').Request,
    TYPES = require('tedious').TYPES;

var connection;


var self = module.exports = {
    execute: function (sql, params, callback) {
        connect()
        connection.on('connect', function (err) {
            var newQuery = sql;
            for (var i = 0; i < params.length; i++) {
                newQuery = newQuery.replace("?", "'" + params[i] + "'");
            }
            var request = new Request(newQuery, function () {
                callback('', results, []);
            });
            var results = [];
            request.on('row', function (columns) {
                var temp = {};
                columns.forEach(function (column) {
                    temp[column.metadata.colName] = column.value;
                });
                results.push(temp);
            });
            connection.execSql(request);
        })
    },
    query: function (sql, callback) {
        connect()
        connection.on('connect', function (err) {
            var newQuery = sql;
            var request = new Request(newQuery, function () {
                callback('', results, []);
            });
            var results = [];
            request.on('row', function (columns) {
                var temp = {};
                columns.forEach(function (column) {
                    temp[column.metadata.colName] = column.value;
                });
                results.push(temp);
            });
            connection.execSql(request);
        })
    },
    close: function () {
        connection.close();
    }
}

function connect() {
    connection = new Connection({
        server: 'hostDB',
        authentication: {
            type: 'default',
            options: {
                userName: 'userDB',
                password: 'passwordDB'
            }
        },
        options: {
            database: 'nameDB',
            encrypt : true
        }
    });

}