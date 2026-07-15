const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Verify connectivity without permanently checking out a client from the pool
if (process.env.NODE_ENV !== 'test') {
    pool.query('SELECT 1')
        .then(() => console.log('Connected to PostgreSQL'))
        .catch((err) => console.error('Database connection error:', err));
}

module.exports = pool;
