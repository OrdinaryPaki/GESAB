import { neon } from '@neondatabase/serverless';

let client;

/** Server-only connection; importing this module never opens a connection. */
export function getLeadDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for durable lead storage.');
  }
  client ??= neon(process.env.DATABASE_URL);
  return client;
}
