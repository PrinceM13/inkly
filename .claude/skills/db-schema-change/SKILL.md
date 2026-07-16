---
name: db-schema-change
description: This skill should be used when the user asks to add/change a database column or table, modify src/db/schema/*.ts, add a new note field, or run/generate a drizzle migration in this repo. Also applies when regenerating the better-auth schema (user/session/account/verification tables).
---

# Changing the Inkly database schema

This repo uses Drizzle ORM over SQLite (better-sqlite3 in dev, Turso in
prod), with migrations tracked in `src/db/migrations/` and applied
automatically at runtime by `src/lib/db.ts` via `drizzle-orm`'s migrator.
See SPEC.md §6 for the canonical table shapes.

## Workflow for app-owned tables (e.g. `notes`)

1. Edit the Drizzle schema in `src/db/schema/notes.ts` (or add a new file
   under `src/db/schema/` and export it from `src/db/schema/index.ts`).
2. Generate a migration: `pnpm db:generate`.
3. Read the generated SQL in `src/db/migrations/NNNN_*.sql` — confirm it
   only contains the change you intended (drizzle-kit diffs against the
   last snapshot in `src/db/migrations/meta/`).
4. Migrations apply automatically the next time `src/lib/db.ts` opens a
   connection (dev server restart, or next request) — no separate
   `pnpm db:migrate` step needed locally. Use `pnpm db:migrate` explicitly
   only for a scripted/CI deploy step that must apply migrations before
   the app boots.
5. Commit the new `.sql` file and its `meta/` snapshot together with the
   schema change — never edit a already-committed migration file.

## Workflow for auth tables (`user`, `session`, `account`, `verification`)

These are owned by better-auth, not hand-edited (SPEC.md §6). Regenerate
via `npx auth@latest generate` (per CLAUDE.md, look up current better-auth
CLI docs with the docs-explorer subagent first — the command name has
changed between major versions), then follow the same `pnpm db:generate` /
review / commit steps above for the resulting schema diff.

## Raw SQL that Drizzle can't express

Some DDL — e.g. the `notes_fts` FTS5 virtual table — has no Drizzle schema
representation and needs a hand-written migration instead of
`pnpm db:generate`. See [references/custom-sql-migrations.md](references/custom-sql-migrations.md)
for how to add one.
