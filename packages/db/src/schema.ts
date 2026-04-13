import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./schema-helpers";

export const sources = pgTable("sources", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 180 }).notNull(),
  url: text("url").notNull().unique(),
  ...timestamps,
});

export const statuses = pgTable("statuses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 20 }).notNull().unique(),
  ...timestamps,
});

export const skills = pgTable("skills", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 80 }).notNull().unique(),
  ...timestamps,
});

export const company = pgTable("companies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 80 }).notNull().unique(),
  ...timestamps,
});
