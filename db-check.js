
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const { Pool } = pg;
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aniparadise',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root123',
});

async function check() {
    try {
        const users = await pool.query('SELECT id, username, email FROM users');
        console.log('--- Users ---');
        console.table(users.rows);

        const tracker = await pool.query('SELECT * FROM tracker');
        console.log('\n--- Tracker ---');
        console.table(tracker.rows);

        const platforms = await pool.query('SELECT * FROM platforms');
        console.log('\n--- Platforms ---');
        console.table(platforms.rows);

    } catch (err) {
        console.error('Error querying database:', err.message);
    } finally {
        await pool.end();
    }
}

check();
