const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'deeznuts',
    database: 'office_db'
});

// Connect to the database
connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to the database.');
});

// Export the connection object for use in other modules
module.exports = connection;

