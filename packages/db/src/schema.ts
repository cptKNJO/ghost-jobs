import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// You can add more tables and relations here
// export const posts = pgTable('posts', {
//   id: serial('id').primaryKey(),
//   title: text('title').notNull(),
//   content: text('content'),
//   userId: integer('user_id').references(() => users.id),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });
