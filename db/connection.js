const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
console.log(ENV)

const config =
  ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool(config);
