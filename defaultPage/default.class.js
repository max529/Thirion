var connection = require('./conn');
var utils = require('./utils');

var DefaultObject = {
    add(insertProp) {
        return new Promise((resolve, reject) => {
            connection.execute(
                'insertSentence',
                insertVar,
                function (err, results, fields) {
                    resolve(results.insertId);
                }
            );
        })
    },
    update(updateProp) {
        return new Promise((resolve, reject) => {
            connection.execute(
                'updateSentence',
                updateVar,
                function (err, results, fields) {
                    resolve();
                }
            );
        })
    },
    delete(deleteProp) {
        return new Promise((resolve, reject) => {
            connection.execute(
                'deleteSentence',
                deleteVar,
                function (err, results, fields) {
                    resolve();
                }
            );
        })
    },
    getAll() {
        return new Promise((resolve, reject) => {
            connection.query(
                'selectAllSentence',
                function (err, results, fields) {
                    results = JSON.parse(JSON.stringify(results));
                    resolve(results);
                }
            );
        })
    },
    getByIdWithLink(selectByIdProp) {
        selectWithLink
    },
    getById(selectByIdProp) {
        return new Promise((resolve, reject) => {
            connection.execute(
                'selectByIdSentence',
                selectByIdVar,
                function (err, results, fields) {
                    results = JSON.parse(JSON.stringify(results));
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(null);
                    }
                }
            );
        })
    }
}

module.exports = DefaultObject;