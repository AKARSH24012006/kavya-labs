import { Pool } from "pg";

// One pool per server instance. In dev, reuse it across hot reloads.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

function createPool() {
  const url = process.env.DATABASE_URL;
  const local = !url || /localhost|127\.0\.0\.1/.test(url);
  return new Pool({
    connectionString: url,
    ssl: local ? false : { rejectUnauthorized: false },
    max: 5,
  });
}

export const pool = globalForPg.pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []) {
  const res = await pool.query(text, params);
  return res.rows as T[];
}
