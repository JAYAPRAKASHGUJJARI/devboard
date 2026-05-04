import pool from "./db.js";

const res = await pool.query("SELECT NOW()");
console.log("Database connected! Time:", res.rows[0].now);
pool.end();