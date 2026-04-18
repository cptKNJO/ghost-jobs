# Supabase Local Development and Drizzle Migrations

This document outlines the workflow for managing Drizzle migrations and ensuring they are in sync with your local Supabase PostgreSQL database.

## Workflow: Syncing Drizzle Migrations with Local Supabase PostgreSQL

To ensure Drizzle migrations are in sync with your local Supabase PostgreSQL, follow these steps:

1.  **Start Local Supabase:**
    Ensure your local Supabase instance is running. You can typically do this with:
    ```bash
    pnpm --filter @repo/supabase dev
    ```

2.  **Generate Drizzle Migrations:**
    After making any changes to your Drizzle schema files (e.g., in `packages/db/src/schema.ts`), generate new migration files.
    The `@repo/db` package is configured to output migrations directly into the Supabase migration folder.
    ```bash
    pnpm --filter @repo/db generate
    ```
    This will create a new migration file in `packages/supabase/supabase/migrations/`.

3.  **Apply Migrations to Local Supabase:**
    Once migrations are generated, apply them using the Supabase CLI:
    ```bash
    pnpm --filter @repo/supabase migration up
    ```
    This command executes the pending SQL migration files against your local Supabase database.

4.  **Reset Database (Optional):**
    If you need to completely reset your local database and re-apply all migrations:
    ```bash
    pnpm --filter @repo/supabase reset
    ```

5.  **Verify (Optional but Recommended):**
    You can verify the changes by using Drizzle Studio or by checking your local Supabase Studio dashboard:
    *   **Drizzle Studio:**
        ```bash
        pnpm --filter @repo/db studio
        ```
    *   **Supabase Studio:**
        Navigate to your local Supabase Studio (usually `http://localhost:54323` if default) in your browser to visually confirm the schema changes.
