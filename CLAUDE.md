# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Uses pnpm (not npm — `package-lock.json` was removed).

- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` — static export to `out/` (deployable to any static host)
- `pnpm lint` — Biome check (lint + format verification)
- `pnpm format` — Biome format, writes changes

There is no test suite.

Docker (unprivileged Nginx serving the static export on port 8080):

```bash
docker build -t projects-and-blogs .
docker run --rm -p 8080:8080 projects-and-blogs
```

## Architecture

Next.js 16 App Router site with Nextra 4 (blog theme) for MDX content, exported as a fully static site (`output: "export"` in `next.config.ts`).

- **Static export constraint**: no server features — no API routes, no dynamic SSR, no Image Optimization (`images.unoptimized` is set). `trailingSlash: true` is on, so routes resolve as `/docs/` not `/docs`.
- **MDX pages** live directly in the App Router, e.g. `src/app/docs/page.mdx`. New MDX routes are added the same way. Each MDX section wraps itself in the Nextra blog `Layout` via its own `layout.tsx` (see `src/app/docs/layout.tsx`); the root layout is plain Next.
- **`mdx-components.tsx`** (repo root) supplies global MDX components from `nextra-theme-blog`. It's wired to the MDX pipeline via the `turbopack.resolveAlias["next-mdx-import-source-file"]` entry in `next.config.ts` — don't move or rename it without updating that alias.
- **Styling**: CSS Modules work in both TSX and MDX (colocated `*.module.css`, imported and referenced via the styles object). Nextra's theme stylesheet is imported once in the root layout.
- **React Compiler** is enabled (`reactCompiler: true`) — don't hand-add `useMemo`/`useCallback` for memoization purposes.
- **Resume pages**: `/parth` and `/shine` render a shared `Resume` component (`src/components/resume/`) from typed data files in `src/components/resume/data/`; its design was ported from the user's minimalist CV theme (github.com/sinhaparth5/cv). Assets live in `public/cv/`.
