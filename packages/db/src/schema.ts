import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./schema-helpers";

export const sources = pgTable("sources", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 180 }).notNull(),
  url: text("url").notNull().unique(),
  ...timestamps,
});
