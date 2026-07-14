import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { schema } from "@/db/schema";

// DATABASE_URL uses the libSQL/Turso "file:" URL convention (SPEC.md §15) so the
// same env var works in prod; better-sqlite3 wants a bare filesystem path.
const dbPath = (process.env.DATABASE_URL ?? "file:./local.db").replace(
  /^file:/,
  "",
);

// CREATE TABLE statements mirror src/db/schema/*.ts — keep both in sync.
const DDL = `
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expiresAt INTEGER NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS session_userId_idx ON session(userId);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  password TEXT,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt INTEGER,
  refreshTokenExpiresAt INTEGER,
  scope TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS account_userId_idx ON account(userId);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY NOT NULL,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  createdAt INTEGER,
  updatedAt INTEGER
);
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification(identifier);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  search_content TEXT NOT NULL,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  is_public INTEGER NOT NULL DEFAULT 0,
  public_id TEXT UNIQUE,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
`;

// notes_fts is a standalone (non-external-content) FTS5 table — it will not
// auto-sync with writes to `notes`; note create/update/delete code must mirror
// changes into it explicitly.
const FTS_DDL = `
CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
  note_id,
  title,
  content
);
`;

function createConnection() {
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  try {
    sqlite.exec(DDL);
    sqlite.exec(FTS_DDL);
  } catch (err) {
    throw new Error(
      `Failed to initialize database schema (is FTS5 support missing from this SQLite build?): ${err}`,
    );
  }

  return drizzle({ client: sqlite, schema });
}

// Reuse the connection across Next.js dev-server Fast Refresh reloads instead
// of reopening the DB file (and re-running the DDL) on every edit.
declare global {
  var __inklyDb: ReturnType<typeof createConnection> | undefined;
}

export const db = globalThis.__inklyDb ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalThis.__inklyDb = db;
}
