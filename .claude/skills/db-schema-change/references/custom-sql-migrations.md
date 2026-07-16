# Custom SQL migrations

`pnpm db:generate` (`drizzle-kit generate`) only produces SQL for objects
declared in `src/db/schema/*.ts`. It cannot see or emit DDL for things
like SQLite virtual tables, triggers, or views — those need a hand-written
migration file instead.

## Example in this repo: `notes_fts`

`src/db/migrations/0001_notes_fts.sql` creates the FTS5 virtual table used
for search (SPEC.md §6, §194). It was generated as an empty file via:

```bash
npx drizzle-kit generate --custom --name=notes_fts
```

then hand-filled with the raw DDL:

```sql
CREATE VIRTUAL TABLE notes_fts USING fts5(
	note_id,
	title,
	content
);
```

## When to reach for this

Use `drizzle-kit generate --custom --name=<description>` whenever a schema
change needs SQL that isn't expressible as a Drizzle table/column, for
example:

- FTS5 virtual tables (search indexes)
- Triggers (e.g. auto-syncing `notes_fts` with writes to `notes` —
  currently NOT set up; note create/update/delete code in
  `server/actions`/`server/services` must mirror changes into `notes_fts`
  explicitly, per the comment in `src/lib/db.ts`)
- Views
- Data backfills that aren't pure schema changes

The command produces an empty `.sql` file in `src/db/migrations/` with the
next sequence number, already registered in `meta/_journal.json` — fill it
in, then it applies the same way as a generated migration (automatically
on next `src/lib/db.ts` connection, or via `pnpm db:migrate`).

Never edit `meta/_journal.json` or the `meta/NNNN_snapshot.json` files by
hand — those are drizzle-kit's own bookkeeping and get corrupted easily.
