const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
}

const pool = mysql.createPool(config);

async function transcation(sql, value) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let result = [];
        for(let i = 0; i < sql.length; i++){
            const queryResult = await connection.query(sql[i], value[i]);
            await result.push(queryResult[0]);
        }
        
        await connection.commit();
        return result
    } catch (error) {
        console.log(error)
        connection.rollback();
    } finally {
        connection.release();
    }
}

module.exports = transcation;