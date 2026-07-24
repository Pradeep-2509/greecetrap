import { getConnectionString } from "@netlify/database";
import pg from "pg";

const { Pool } = pg;
let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
      max: 5,
      idleTimeoutMillis: 30000
    });
  }
  return pool;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function errorResponse(error, status = 500) {
  console.error(error);
  return json({ error: error?.message || "Server error" }, status);
}
