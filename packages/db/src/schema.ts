import {
  integer,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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

export const companies = pgTable("companies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 80 }).notNull().unique(),
  ...timestamps,
});

// Auth
// Reference the existing Supabase 'auth' schema
const authSchema = pgSchema("auth");

// This is required to refer to this non-public Supabase table to be
// "seen" by drizzle. If we don't bring in the auth table like this,
// we have to manually  migrate for creating an FK constraint on profile.
const usersInAuth = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = pgTable("profiles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersInAuth.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", {
    length: 50,
  })
    .notNull()
    .unique(),
  ...timestamps,
});

export const jobPost = pgTable("job_post", {
  // FKs
  companyId: integer("company_id").references(() => companies.id),
  sourceId: integer("source_id").references(() => sources.id),
  statusId: integer("status_id")
    .notNull()
    .references(() => statuses.id),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
    }),

  // Dates
  appliedOn: timestamp("applied_on", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  repliedOn: timestamp("replied_on", {
    withTimezone: true,
  }),

  // Other fields
  role: text("role").notNull(),
  linkToPost: text("link_to_post").notNull(),
});
