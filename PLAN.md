# Implementation Plan: Prisma + Postgres backend, then Tiptap editor + admin

## Context

The site is currently a fully static export (`output: "export"`) with blog posts as MDX files and hardcoded list data. Goal: articles live in Postgres (`POSTGRES_URL` already in `.env`), authored through a Tiptap rich-text editor adapted from the reference implementation in `editor-design/` (Tiptap v3, outputs HTML strings, Harvard-citation extension, image upload).

Two phases: **A** — Prisma/Postgres foundation with public blog routes reading from the DB; **B** — admin area with login, article form, and the ported editor.

### Decisions (agreed)

- Drop static export → Node server (`output: "standalone"`); Docker runs the Next.js server instead of Nginx-serving-files.
- DB replaces MDX: the 4 existing posts get seeded into Postgres, MDX files deleted. Public URLs stay `/pb/blogs/<slug>/` and `/sb/blogs/<slug>/`.
- Auth: single `ADMIN_PASSWORD` env + signed httpOnly session cookie (jose HS256). No user accounts.
- Images: S3-compatible object storage (`@aws-sdk/client-s3`, works for Cloudflare R2 and AWS S3).
- Deferred: Turnstile, TTS audio components, public table of contents.

### Next.js 16 facts verified in bundled docs (`node_modules/next/dist/docs/01-app/`)

- Middleware is renamed **`proxy.ts`** (`16-proxy.md`) — optimistic checks only; real auth must live in every action/route.
- `cacheComponents` is opt-in; we stay on the previous caching model (`caching-without-cache-components.md`). Pages without request-time APIs prerender at **build** time — DB-backed routes must set `export const dynamic = "force-dynamic"` or the Docker build would freeze query results into the pages.
- Server actions (`07-mutating-data.md`) for form mutations; a route handler (`15-route-handlers.md`) for the binary image upload.
- Standalone output requires copying `public/` and `.next/static` into `.next/standalone` (`output.md`).

---

## Phase A — Prisma + Postgres

### A1. Dependencies

- [ ] `pnpm add @prisma/client@^6`; `pnpm add -D prisma@^6 tsx`
- [ ] `pnpm-workspace.yaml` `allowBuilds`: add `prisma`, `@prisma/client`, `@prisma/engines`, `esbuild` (else postinstall scripts are silently skipped → missing generated client)

### A2. Schema — `prisma/schema.prisma`

- [ ] Generator output `../src/generated/prisma` (standalone-tracing safety); add `src/generated/` to `.gitignore` and Biome ignore list
- [ ] Datasource `env("POSTGRES_URL")`
- [ ] Model `Article`: `id` cuid, `blog` enum (`pb`|`sb`), `slug`, `title`, `summary`, `tags String[]`, `bodyHtml`, `status` enum (`DRAFT`|`PUBLISHED`), `publishedAt?`, `createdAt`, `updatedAt`; `@@unique([blog, slug])`; index `[blog, status, publishedAt]`
- Fallback if Turbopack chokes on the generated client: default output location (Next's `serverExternalPackages` covers `@prisma/client`)

### A3. Client singleton — `src/lib/db.ts`

- [ ] globalThis-cached `PrismaClient` (dev hot-reload pattern)

### A4. Migrate + seed

- [ ] `pnpm exec prisma migrate dev --name init` (if the pooled URL blocks migrations, add `directUrl` with an unpooled env var)
- [ ] `prisma/seed.ts` (run via tsx): upsert the 4 MDX posts as HTML — metadata from `src/components/blog/data/parth.ts` / `shine.ts`, bodies hand-converted from the `page.mdx` files (drop in-file h1/byline/back-link; the post page renders those). `status: PUBLISHED`, `publishedAt` from front matter
- [ ] `package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }` + `"db:seed"` script

### A5. `next.config.ts`

- [ ] `output: "standalone"` (was `"export"`); keep `reactCompiler`, `trailingSlash`, `images.unoptimized`, nextra wrapper + mdx alias (keeps `/docs`)

### A6. Data access — `src/lib/articles/queries.ts`

- [ ] Wrapped in React `cache()`: `getPublishedArticles(blog)`, `getPublishedArticle(blog, slug)`, admin `getAllArticles()` / `getArticle(id)`

### A7. Rewire public routes (URLs unchanged)

- [ ] Replace `data/parth.ts` + `data/shine.ts` with `src/components/blog/data/site.ts` (per-blog masthead constants); `BlogPost[]` built from DB rows
- [ ] `src/app/pb/blogs/page.tsx` + sb twin: async, `dynamic = "force-dynamic"`, query → `<BlogList/>` (BlogList/Masthead/blog.module.css unchanged)
- [ ] New `src/app/{pb,sb}/blogs/[slug]/page.tsx`: `force-dynamic`, `generateMetadata`, `notFound()` for missing/unpublished; renders in `PostShell` → h1 + `.byline` + minimal `ArticleHtml` (dangerouslySetInnerHTML inside existing `.prose`)
- [ ] Delete `(posts)` route groups (2 layouts + 4 MDX files) and old data files
- Caching: force-dynamic everywhere for now; admin actions will call `revalidatePath` (no-op today, future-proofs tag caching)

### A8. Dockerfile

- [ ] node:24-alpine build stage: `prisma generate && pnpm build`
- [ ] Runtime stage: copy `.next/standalone`, `public/`, `.next/static`; `USER node`; `PORT=8080`; `CMD ["node","server.js"]`
- [ ] **Add `.env*` to `.dockerignore`** (currently missing — secrets would bake into the image)
- [ ] Delete `nginx.conf`; migrations run out-of-band via `prisma migrate deploy`
- Alpine note: add `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` if Prisma complains

### A9. Housekeeping

- [ ] Update CLAUDE.md (commands, drop static-export section, document DB/deploy model)
- `editor-design/` stays excluded from tsconfig/biome until B9

### A10. Phase A verification

- [ ] Migrate + seed = 4 rows in DB
- [ ] `pnpm dev`: blog lists/posts render identically to before; `/docs`, `/parth`, `/shine` untouched
- [ ] `pnpm build` succeeds with `.env` temporarily renamed (proves no build-time DB access)
- [ ] `docker build` + `docker run -e POSTGRES_URL=...` serves all routes as non-root
- [ ] `pnpm lint` clean

---

## Phase B — Editor + admin

### B1. Dependencies + env

- [ ] `@tiptap/react @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-{image,placeholder,text-align,highlight,text-style,character-count,table}` (v3), `lucide-react`, `sanitize-html` (+types), `cheerio`, `jose`, `@aws-sdk/client-s3`
- [ ] New env vars: `ADMIN_PASSWORD`, `SESSION_SECRET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_PUBLIC_BASE_URL`

### B2. Auth

- [ ] `src/lib/auth/session.ts`: jose HS256 JWT in `admin_session` cookie (httpOnly, 7d); `requireAdmin()` (redirect) + `isAdmin()` (401)
- [ ] `src/proxy.ts`, `matcher: ["/admin/:path*", "/api/admin/:path*"]` — optimistic redirect only; **every** action/page/route re-checks
- [ ] `login` action (`crypto.timingSafeEqual` vs `ADMIN_PASSWORD`), `logout` action

### B3. HTML pipeline — `src/lib/articles/`

- [ ] `sanitize.ts`: sanitize-html allowing exactly the editor's output (prose tags, figure/figcaption, tables, `span[data-ref-*]`, `sup`, `mark`, img incl. `data:` fallback + `data-caption`/`loading`/`decoding`, restricted inline styles). **Runs once at save time**
- [ ] `html-transform.ts` (cheerio, server-only): exports `HeadingEntry {id,level,text}`; `transformArticleHtml(html) → {html, headings, references}` — slugified deduped h2/h3 ids, wrap `img[data-caption]` in figure/figcaption, extract `span[data-ref-id]` refs. **Runs at render time** (stored HTML stays editor-round-trippable)

### B4. Image upload — `src/app/api/admin/articles/images/route.ts`

- [ ] `isAdmin()` else 401; raster MIME only (no svg), ≤8 MB; key `articles/YYYY/MM/uuid.ext`; S3 `PutObjectCommand` (`forcePathStyle` for R2); return `{url}` (matches editor's existing fetch contract)

### B5. Server actions — `src/lib/admin/actions.ts`

- [ ] `saveArticle`: requireAdmin → validate slug `^[a-z0-9-]+$` → sanitize body → upsert (catch P2002 → "slug already used") → status/publishedAt per intent (save|publish|unpublish) → `revalidatePath` → `redirect("/admin")`
- [ ] `deleteArticle`; auth actions in `src/lib/auth/actions.ts`

### B6. Admin UI (blog design language: `blogFontVariables` + `admin.module.css`)

- [ ] `src/app/admin/layout.tsx` (header + logout), `login/page.tsx` (useActionState form), `page.tsx` (article table: blog/status chips, dates, edit/delete, New)
- [ ] `articles/new/page.tsx` + `articles/[id]/edit/page.tsx` → shared `src/components/admin/ArticleForm.tsx` (client): blog select, title, slug (auto-slug until touched), summary, tags CSV, `<ArticleBodyField ref>`; submit reads `ref.current.getHTML()` into FormData then `startTransition(formAction)`

### B7. Port editor → `src/components/editor/`

- [ ] `ReferenceExtension.ts`, `ArticleBodyField.tsx`: copy as-is
- [ ] `TiptapEditor.tsx`: copy logic **verbatim**, restyle only — `editor.module.css` defines the reference tokens (`--border`, `--surface`, `--foreground`, `--muted`…) from the blog palette; collapse Tailwind clusters into ~15 semantic classes; apply blog `.prose` to `EditorContent` for WYSIWYG parity; ProseMirror internals via `:global`. Escape hatch: single horizontal toolbar (keep all buttons)
- [ ] Port `ArticleBody.tsx` → `src/components/blog/ArticleBody.tsx` (lightbox + ¶ heading anchors, CSS Modules); replace Phase A's `ArticleHtml` in both `[slug]` pages

### B8. Public rendering

- [ ] Heading ¶ copy-link anchors
- [ ] `ReferenceList.tsx` bibliography (Harvard, from extracted refs; superscripts link to `#ref-<id>`)
- TOC deferred (headings already extracted; layout decision pending)

### B9. Cleanup

- [ ] Delete `editor-design/`; remove exclusions from `tsconfig.json`, `biome.json`, `.dockerignore`; update CLAUDE.md (admin, auth, S3 vars, pipeline)

### B10. Deferred (explicit)

Turnstile on login · TTS audio (AdminGenerateAudio/ArticleListen) · public TOC · tag-based caching · login rate-limiting

### B11. Phase B verification

- [ ] Anonymous `/admin/*` redirects to login; upload route returns 401
- [ ] Wrong password → inline error; correct → article list with 4 seeded rows
- [ ] E2E: create pb article (auto-slug, headings/table, image upload → S3 object + URL renders, citation) → draft hidden publicly → publish → public page shows prose, figure + lightbox, ¶ anchors, citation → References section
- [ ] Re-edit round-trips stored HTML intact (chips, captions)
- [ ] Sanitization strips `<script>` / `onclick` payloads
- [ ] Logout clears session; `pnpm lint` + `pnpm build` + docker run E2E

---

## Risks

- Build-time DB access if any route forgets `force-dynamic` — test by building with `.env` renamed.
- Prisma generated-client bundling under Turbopack/standalone — validate `docker run` early (A10); fallback in A2.
- Pooled Postgres URL may block `migrate dev` → use `directUrl`.
- `.dockerignore` missing `.env` today — must fix before any image build.
- Proxy is optimistic-only — every server entry point re-checks auth.
- Tiptap restyle regressions — port logic verbatim, translate classNames only.
