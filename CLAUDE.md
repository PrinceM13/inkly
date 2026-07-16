# CLAUDE.md

We're building the app described in @SPEC.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architechture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the docs-explorer subagent for efficient documentation lookups.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project status

Inkly is a note-taking web app. Right now the repo is just the `create-next-app` scaffold plus tooling (Prettier/ESLint/husky/commitlint) — `src/app` only has a landing page (`layout.tsx`, `page.tsx`, `globals.css`). None of the app's real features (auth, notes, editor, DB) exist yet.

**`SPEC.md` is the authoritative technical spec for the intended app** — read it before implementing any feature. It defines the full tech stack, database schema, routes, API/server actions, TipTap editor config, autosave behavior, and validation rules. Key decisions from it:

- **Stack**: Next.js App Router + TypeScript, Tailwind CSS, shadcn/ui, lucide-react; better-auth for auth; Drizzle ORM over SQLite (dev, via better-sqlite3) / Turso libSQL (prod); TipTap for rich text; Zod for validation.
- **Auth schema is owned by better-auth**, generated via `npx auth@latest generate`/`migrate` — the `user`/`session`/`account`/`verification` tables use singular names and camelCase columns by better-auth convention and must not be hand-edited or renamed to `users`/snake_case.
- **Notes** (`notes` table) are app-owned, soft-deleted (`deletedAt`, 30-day retention via Vercel Cron), and searched via a SQLite FTS5 virtual table (`notes_fts`) over title/content — not a naive `LIKE` scan.
- **Public sharing** exposes a note read-only at `/shared/[publicId]` using a random, URL-safe `publicId` (≥24 chars) — never the note's internal `id` — and those pages must not be indexed by search engines.
- Planned `src/` layout groups routes as `(auth)`/`(dashboard)`/`api`/`shared`, with `components/`, `db/` (schema, migrations), `lib/` (auth, tiptap, search, utils), and `server/` (actions, services) — see SPEC.md §14 for the full tree before creating new top-level dirs.

## Commands

Package manager is **pnpm** (Node >= 20.9); do not use npm/yarn.

```bash
pnpm install       # also installs husky git hooks via `prepare`
pnpm dev           # start dev server at localhost:3000
pnpm build         # production build
pnpm start         # run production build
pnpm lint          # ESLint
pnpm format:check  # Prettier check, no writes (CI)
pnpm format:fix    # Prettier write
```

There is no test script configured yet.

## Architecture notes

- Path alias `@/*` resolves to `./src/*` (see `tsconfig.json`).
- `next.config.ts` is currently unmodified default config.
- Husky hooks (`.husky/pre-commit`, `.husky/commit-msg`) run `lint-staged` and `commitlint` respectively — see `AGENTS.md` for the formatting/commit conventions they enforce.
