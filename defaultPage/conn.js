const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'hostDB',
    user: 'userDB',
    password: 'passwordDB',
    database: 'nameDB'
});


module.exports = connection;