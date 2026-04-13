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
    After making any changes to your Drizzle schema files (e.g., in `packages/db/src/schema.ts`), generate new migration files. This command compares your current schema definition with the last known migration and creates a new SQL file if differences are found:
    ```bash
    pnpm --filter db db:generate
    ```
    This will create a new migration file in `packages/db/drizzle/migrations/`.

3.  **Apply Drizzle Migrations to Local Supabase:**
    Once migrations are generated, apply them to your local PostgreSQL database:
    ```bash
    pnpm --filter db db:migrate
    ```
    This command executes the pending SQL migration files against your database.

4.  **Verify (Optional but Recommended):**
    You can verify the changes by using Drizzle Studio or by checking your local Supabase Studio dashboard:
    *   **Drizzle Studio:**
        ```bash
        pnpm --filter db db:studio
        ```
        This will open a web interface to inspect your database schema and data.
    *   **Supabase Studio:**
        Navigate to your local Supabase Studio (usually `http://localhost:8000/project/_/database/tables`) in your browser to visually confirm the schema changes.
