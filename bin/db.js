import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config('../.env');

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'node_restapi',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
