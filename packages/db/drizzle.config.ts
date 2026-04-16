import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "../supabase/supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  migrations: {
    prefix: "timestamp", // Options: 'index' (0001), 'timestamp' (YYYYMMDDHHMMSS), or 'none'
  },
  // CRITICAL: Tell Drizzle to ONLY manage the public schema.
  // This prevents it from trying to 'create' the auth schema.
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
