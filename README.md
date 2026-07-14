This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Development setup

**Prerequisites:** Node.js >= 20.9 and [pnpm](https://pnpm.io) (this repo uses a `pnpm-lock.yaml`, not npm/yarn).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result. Edit `src/app/page.tsx` — the page auto-updates as you save.

### Scripts

| Script              | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Start the dev server                       |
| `pnpm build`        | Production build                           |
| `pnpm start`        | Run the production build                   |
| `pnpm lint`         | Run ESLint                                 |
| `pnpm format:check` | Check formatting with Prettier (no writes) |
| `pnpm format:fix`   | Apply Prettier formatting                  |

### Code style & commits

Formatting, linting, and Tailwind class sorting are handled by Prettier/ESLint and auto-applied on staged files via a `lint-staged` + husky `pre-commit` hook. Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`, `chore: ...`) and are enforced by a `commit-msg` hook. Both hooks are installed automatically by `pnpm install` (`prepare` script). See [`AGENTS.md`](./AGENTS.md) for the full conventions.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
