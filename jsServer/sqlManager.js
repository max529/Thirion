"use strict"
var self = module.exports = {
    connect: function (path) {
        var mysql = require('mysql2');
        var fs = require("fs");

        var infoConn = JSON.parse(fs.readFileSync(path + "project.config.json", 'utf8'));
        // create the connection to database
        var connection = mysql.createConnection({
            host: infoConn.db.host,
            user: infoConn.db.username,
            password: infoConn.db.pass,
            database: infoConn.db.name
        });
        return connection;
    },
    parseData: function (data, link, path) {
        var connect = self.connect(path);
        var recu = function (data, i) {
            return new Promise((resolve, reject) => {
                if (i == data.length) {
                    resolve();
                }
                var ob = data[i];
                console.log(ob);
                connect.query("SHOW TABLES LIKE '" + ob.name.toLowerCase() + "'", function (err, results, fields) {
                    if (err)
                        console.log(err);
                    if (results.length == 0) {
                        self.createTable(path, ob, connect).then(() => {
                            recu(data, i + 1).then(() => {
                                resolve();
                            })
                        })
                    } else {
                        recu(data, i + 1).then(() => {
                            resolve();
                        })
                    }
                })
            })
        }
        recu(data, 0).then(() => {

        })
    },
    createTable: function (path, objet, connect) {
        return new Promise((resolve, reject) => {
            objet.name = objet.name.toLowerCase();
            var cmd = "CREATE TABLE " + objet.name + "(";
            var primIndex = [];
            for (var i = 0; i < objet.prop.length; i++) {
                var prop = objet.prop[i];
                prop[1] = self._determineType(prop[1]);
                cmd += prop[0] + " " + prop[1] + " NOT NULL"
                if (prop[2]) {
                    primIndex.push(i);
                    if (prop[1] == "INT") {
                        cmd += " AUTO_INCREMENT,";
                    }
                } else {
                    cmd += ","
                }
            }
            if (primIndex.length > 0) {
                cmd += "PRIMARY KEY (";
                for (var i = 0; i < primIndex.length; i++) {
                    var current = objet.prop[primIndex[i]];
                    cmd += current[0];
                }
                cmd += "),"
            }
            cmd = cmd.slice(0, -1);
            cmd += ");";

            console.log(cmd);
            connect.execute(cmd, [], function (err, results, fields) {
                console.log(err);
                console.log(results);
                console.log(fields);
                resolve();
            })

            /*
                CREATE TABLE tutorials_tbl(
                    tutorial_id INT NOT NULL AUTO_INCREMENT,
                    tutorial_title VARCHAR(100) NOT NULL,
                    tutorial_author VARCHAR(40) NOT NULL,
                    submission_date DATE,
                    PRIMARY KEY ( tutorial_id )
                    );
            */
        })
    },
    _determineType: function (type) {
        if (type == "int") {
            return "INT"
        } else if (type == "varchar255") {
            return "VARCHAR(255)"
        } else if (type == "dateTime") {
            return "DATETIME"
        } else if (type == "text") {
            return "TEXT";
        } else if (type == "double") {
            return "DOUBLE";
        }
    }
}