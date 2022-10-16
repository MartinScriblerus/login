import { Pool } from "pg";

let pool;

if (!pool) {
  pool = new Pool({
    user: process.env.AZURE_DB_USER,
    password: process.env.AZURE_DB_PASSWORD,
    host: process.env.AZURE_DB_HOST,
    port: process.env.AZURE_DB_PORT,
    database: process.env.AZURE_DB_NAME,
  });
}

module.exports = {
    getPool: function () {
      if (pool) return pool; // if it is already there, grab it here
      pool = new pg.Pool(pool);
      return pool;
    }
}