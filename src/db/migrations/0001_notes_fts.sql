-- notes_fts is a standalone (non-external-content) FTS5 virtual table — it
-- does not auto-sync with writes to `notes`; note create/update/delete code
-- must mirror changes into it explicitly.
CREATE VIRTUAL TABLE notes_fts USING fts5(
	note_id,
	title,
	content
);