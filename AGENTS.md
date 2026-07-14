<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Code style and formatting

Prettier is the source of truth for formatting; ESLint (`eslint-config-next` + `eslint-config-prettier`) handles code quality only, not style. `prettier-plugin-tailwindcss` auto-sorts Tailwind classes in `className` on every format — don't hand-order classes.

- `pnpm format:check` — verify formatting, no writes (use this in CI)
- `pnpm format:fix` — apply formatting
- `pnpm lint` — run ESLint

Run `pnpm format:fix` and `pnpm lint` before committing.

# Commit messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>: <description>`, e.g. `feat: add landing page hero`.

Common types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`.

This is enforced by commitlint via a husky `commit-msg` hook (`commitlint.config.mjs`) — non-conforming commits are rejected locally, not just flagged in review.
