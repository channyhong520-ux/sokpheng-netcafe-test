import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// Create a pool only if we have a URL, otherwise use a dummy to prevent crash during build
export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  (databaseUrl
    ? new Pool({ connectionString: databaseUrl })
    : ({
        connect: () => Promise.reject(new Error("Database not configured")),
        query: () => Promise.reject(new Error("Database not configured")),
        on: () => {},
        end: () => Promise.resolve(),
      } as unknown as Pool));

if (process.env.NODE_ENV !== "production" && databaseUrl) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
