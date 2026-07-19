# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Uses pnpm (not npm — `package-lock.json` was removed).

- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` — production build with standalone Node output
- `pnpm exec prisma migrate dev --name <name>` — create and apply a local schema migration
- `pnpm exec prisma migrate deploy` — apply committed migrations in deployment environments
- `pnpm db:seed` — idempotently seed the two authors and four starter articles
- `pnpm lint` — Biome check (lint + format verification)
- `pnpm format` — Biome format, writes changes

There is no test suite.

Docker runs the standalone Next.js server as the unprivileged `node` user on port 8080:

```bash
docker build -t projects-and-blogs .
docker run --rm -p 8080:8080 --env-file .env projects-and-blogs
```

Run `prisma migrate deploy` outside the application container before deploying a schema change.

## Architecture

Next.js 16 App Router site with Nextra 4 for documentation and Prisma/Postgres-backed public blogs. Production uses `output: "standalone"` and requires `POSTGRES_URL` at runtime.

- **Articles** are stored in Postgres and queried through the singleton in `src/lib/db.ts`. Public `/pb/blogs/*` and `/sb/blogs/*` routes use request-time rendering so builds never query or snapshot the database.
- **Prisma** schema and migrations live in `prisma/`; seed data is in `prisma/seed.ts`. Articles belong to seeded `parth` and `shine` users.
- **MDX** remains for documentation under `src/app/docs/`, wrapped in the Nextra blog `Layout`. The root layout is plain Next.
- **`mdx-components.tsx`** (repo root) supplies global MDX components from `nextra-theme-blog`. It's wired to the MDX pipeline via the `turbopack.resolveAlias["next-mdx-import-source-file"]` entry in `next.config.ts` — don't move or rename it without updating that alias.
- **Styling**: CSS Modules work in both TSX and MDX (colocated `*.module.css`, imported and referenced via the styles object). Nextra's theme stylesheet is imported once in the root layout.
- **React Compiler** is enabled (`reactCompiler: true`) — don't hand-add `useMemo`/`useCallback` for memoization purposes.
- **Resume pages**: `/parth` and `/shine` render a shared `Resume` component (`src/components/resume/`) from typed data files in `src/components/resume/data/`; its design was ported from the user's minimalist CV theme (github.com/sinhaparth5/cv). Assets live in `public/cv/`.
