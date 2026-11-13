// Applies db/schema.sql. Runs before `next build`, so every Vercel deploy keeps the schema current.
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn("[migrate] DATABASE_URL not set, skipping migrations");
  process.exit(0);
}

const local = /localhost|127\.0\.0\.1/.test(url);
const client = new pg.Client({ connectionString: url, ssl: local ? false : { rejectUnauthorized: false } });
const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");

await client.connect();
try {
  await client.query(sql);
  console.log("[migrate] schema up to date");
} finally {
  await client.end();
}
