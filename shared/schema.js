import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pinned items table - stores user's pinned poetry entries
export const pinnedItems = pgTable(
  "pinned_items",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull(),
    itemName: varchar("item_name").notNull(),
    itemData: jsonb("item_data").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("IDX_pinned_items_user_id").on(table.userId),
    unique("unique_user_item").on(table.userId, table.itemName),
  ]
);

// Journal entries table - stores user's writing entries (synced across devices)
export const journalEntries = pgTable(
  "journal_entries",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull(),
    title: varchar("title").notNull().default(''),
    content: varchar("content").notNull().default(''),
    templateRef: varchar("template_ref"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("IDX_journal_entries_user_id").on(table.userId),
    index("IDX_journal_entries_updated").on(table.userId, table.updatedAt),
  ]
);
