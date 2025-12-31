import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create Neon serverless pool
// Note: Neon serverless Pool manages connections automatically and efficiently
// for serverless/autoscale environments. It handles connection pooling internally.
export const pool: Pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db: NeonDatabase<typeof schema> = drizzle({ client: pool, schema });

// Handle pool errors to prevent crashes
// Note: Neon serverless Pool may not emit all standard pg-pool events,
// but error handling is still important for resilience
try {
  if (typeof pool.on === 'function') {
    pool.on('error', (err: Error) => {
      console.error('Unexpected database pool error:', err);
    });
  }
} catch (error) {
  // Pool event handling not available, which is fine for Neon serverless
  // The pool will still handle errors internally
}
