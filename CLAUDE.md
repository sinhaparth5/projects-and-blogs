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
- `pnpm test` — run all `*.test.ts` files under `src/` with Node's built-in test runner (via `tsx`)
- `pnpm test:html` — run only `src/lib/articles/html-pipeline.test.ts` (sanitize + render-transform round-trip coverage)
- `node --import tsx --test path/to/file.test.ts` — run a single test file directly

Docker runs the standalone Next.js server as the unprivileged `node` user on port 8080:

```bash
docker build -t projects-and-blogs .
docker run --rm -p 8080:8080 --env-file .env projects-and-blogs
```

Run `prisma migrate deploy` outside the application container before deploying a schema change. In CI (`.github/workflows/deploy-production.yml`), pushes to `master` decode a base64 production env secret, run `prisma migrate deploy` against it, then build/push the Docker image to GHCR and deploy it over SSH to the VPS.

## Environment

Copy `.env.example` to `.env` for local development. Required runtime values are `POSTGRES_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `R2_ENDPOINT`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, and `R2_BASE_URL`. Generate `SESSION_SECRET` with at least 32 random bytes and never commit `.env`.

## Architecture

Next.js 16 App Router site with Nextra 4 for documentation and Prisma/Postgres-backed public blogs. Production uses `output: "standalone"` and requires `POSTGRES_URL` at runtime.

- **Articles** are stored in Postgres and queried through the singleton in `src/lib/db.ts`. Public `/pb/blogs/*` and `/sb/blogs/*` routes use request-time rendering so builds never query or snapshot the database.
- **Article HTML** is sanitized once before persistence with `src/lib/articles/sanitize.ts`; render-only heading, figure, and reference transformations live in `html-transform.ts`. Do not store transformed HTML because it must remain round-trippable through Tiptap.
- **Article mutations** live in `src/lib/admin/actions.ts`; they authorize inside every action, validate through `article-input.ts`, sanitize before persistence, and revalidate both admin and public paths.
- **Admin UI** lives under the protected `src/app/admin/(workspace)/` route group. The shared form uses the Tiptap components in `src/components/editor/`; keep server authorization in actions even though proxy and layouts also check sessions.
- **Prisma** schema and migrations live in `prisma/`; seed data is in `prisma/seed.ts`. Articles belong to seeded `parth` and `shine` users.
- **Admin auth** uses `ADMIN_PASSWORD` plus a seven-day HS256 session cookie signed with `SESSION_SECRET`. `src/proxy.ts` performs optimistic route checks only; every protected page, action, and route must also call `requireAdmin()` or `isAdmin()`.
- **Article images** are uploaded by the authenticated Node route at `/api/admin/articles/images/` through R2's S3-compatible API. Raster signatures and an 8 MB limit are enforced before upload; public URLs use `R2_BASE_URL`.
- **MDX** remains for documentation under `src/app/docs/`, wrapped in the Nextra blog `Layout`. The root layout is plain Next.
- **`mdx-components.tsx`** (repo root) supplies global MDX components from `nextra-theme-blog`. It's wired to the MDX pipeline via the `turbopack.resolveAlias["next-mdx-import-source-file"]` entry in `next.config.ts` — don't move or rename it without updating that alias.
- **Styling**: CSS Modules work in both TSX and MDX (colocated `*.module.css`, imported and referenced via the styles object). Nextra's theme stylesheet is imported once in the root layout.
- **React Compiler** is enabled (`reactCompiler: true`) — don't hand-add `useMemo`/`useCallback` for memoization purposes.
- **Resume pages**: `/parth` and `/shine` render a shared `Resume` component (`src/components/resume/`) from typed data files in `src/components/resume/data/`; its design was ported from the user's minimalist CV theme (github.com/sinhaparth5/cv). Assets live in `public/cv/`.
