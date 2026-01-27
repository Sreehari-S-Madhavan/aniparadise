
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Error: DATABASE_URL environment variable is not set.');
    console.log('Usage: DATABASE_URL=your_external_url node db-init-prod.js');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initialize() {
    try {
        console.log('⏳ Connecting to database...');
        // Look for database/schema.sql in the parent directory
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('⏳ Executing schema...');
        await pool.query(schema);

        console.log('✅ Database initialized successfully!');

        // Verify tables
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('--- Created Tables ---');
        res.rows.forEach(row => console.log(`- ${row.table_name}`));

    } catch (err) {
        console.error('❌ Error initializing database:', err.message);
    } finally {
        await pool.end();
    }
}

initialize();
