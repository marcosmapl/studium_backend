require("dotenv").config();
const mysql = require("mysql2/promise");

async function check() {
  const url = process.env.DATABASE_URL;
  console.log("Using DATABASE_URL from .env:", url);
  try {
    // Parse host, port, user, password and db from URL
    const regex = /mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/;
    const match = url.match(regex);
    if (!match) throw new Error("DATABASE_URL not in expected format");

    const user = match[1];
    const password = match[2];
    const host = match[3];
    const port = match[4];
    const database = match[5];

    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });
    const [rows] = await conn.query("SELECT 1 as result");
    console.log("✅ DB connection successful");
    console.log("DB test query result:", rows[0]);
    await conn.end();
  } catch (err) {
    console.log("❌ DB connection failed");
    console.error(err);
    process.exit(1);
  }
}

check();
