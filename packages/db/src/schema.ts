// packages/db/src/schema.ts
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const sources = pgTable("sources", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 180 }).notNull(),
  url: text("url").notNull().unique(),
});
