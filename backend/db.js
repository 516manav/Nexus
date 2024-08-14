import pg from 'pg';
import config from './config.js';

const db = new pg.Client({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_DATABASE,
    password: config.DB_PASSWORD,
    port: config.DB_PORT
});

db.connect();

export default db;