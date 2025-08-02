import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  githubUsername: varchar("github_username"),
  githubAccessToken: text("github_access_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pinned repositories table
export const pinnedRepositories = pgTable("pinned_repositories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  repositoryName: varchar("repository_name").notNull(),
  repositoryOwner: varchar("repository_owner").notNull(),
  repositoryId: varchar("repository_id").notNull(),
  pinnedAt: timestamp("pinned_at").defaultNow(),
});

// GitHub user data cache table
export const githubUserData = pgTable("github_user_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  githubUsername: varchar("github_username").notNull(),
  profileData: jsonb("profile_data"),
  repositories: jsonb("repositories"),
  languageStats: jsonb("language_stats"),
  contributionStats: jsonb("contribution_stats"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertPinnedRepositorySchema = createInsertSchema(pinnedRepositories).omit({
  id: true,
  pinnedAt: true,
});

export const insertGithubUserDataSchema = createInsertSchema(githubUserData).omit({
  id: true,
  lastUpdated: true,
});

export type InsertPinnedRepository = z.infer<typeof insertPinnedRepositorySchema>;
export type PinnedRepository = typeof pinnedRepositories.$inferSelect;
export type InsertGithubUserData = z.infer<typeof insertGithubUserDataSchema>;
export type GithubUserData = typeof githubUserData.$inferSelect;
