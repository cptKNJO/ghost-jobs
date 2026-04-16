import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // CRITICAL: Tell Drizzle to ONLY manage the public schema.
  // This prevents it from trying to 'create' the auth schema.
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
