// Mirrors the CREATE TABLE statement in src/lib/db.ts — keep both in sync.
// App-owned table (SPEC.md §6), snake_case columns (unlike the auth tables).
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const notes = sqliteTable(
  "notes",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content", { mode: "json" }).notNull(),
    excerpt: text("excerpt").notNull(),
    searchContent: text("search_content").notNull(),
    isPinned: integer("is_pinned", { mode: "boolean" })
      .notNull()
      .default(false),
    isPublic: integer("is_public", { mode: "boolean" })
      .notNull()
      .default(false),
    publicId: text("public_id").unique(),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("notes_user_id_idx").on(table.userId)],
);
