const mysal = require('mysql');
const util = require('util');
require('dotenv').config();

const pool = mysal.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
});

pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log('Database connected successfully');
    connection.release();
})

pool.query = util.promisify(pool.query);

module.exports = pool;