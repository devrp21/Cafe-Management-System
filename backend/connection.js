import mysql2 from 'mysql2';
import { config } from 'dotenv';

config();


var connection = mysql2.createConnection({
    port: process.env.DB_HOST,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (!err) {
        console.log('Connected');
    }
    else {
        console.log(err);
    }
});

export default connection;