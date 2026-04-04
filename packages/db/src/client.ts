import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// This is the main client that other packages will import.
export const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// This type definition can be useful for other packages to infer types.
export type DbClient = typeof db;
