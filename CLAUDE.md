# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Commands

```bash
bun dev              # Start workerd-backed Astro dev server (localhost:4321)
bun run build        # Production build (Astro + Cloudflare adapter)
bun run preview      # Preview the production build locally (also workerd)
bun run typecheck    # Type checking (astro check)
bun run lint         # ESLint with zero warnings (--max-warnings=0)
bun run format:check # Prettier check
bun run format       # Prettier auto-fix

# Full CI check (what integration.yml runs):
bun run format:check && bun run lint && bun run typecheck && bun run build
```

Without Cloudflare credentials, Workers AI remote bindings will try to open a Wrangler OAuth
login. Use `ASTRO_CF_NO_REMOTE=1 bun run preview` (after `bun run build`) to run the site on
workerd without that login. Chat (`/api/assistant`) will 500 until the `AI` binding is available.

With Cloudflare auth (`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`, or `wrangler login`):

```bash
bun dev              # workerd + remote Workers AI
bunx wrangler types  # regenerate worker-configuration.d.ts after wrangler.jsonc changes
bunx wrangler deploy # deploy the Worker (run bun run build first)
```

## Architecture

**Astro 7 (SSR)** deployed to **Cloudflare Workers** via `@astrojs/cloudflare` (`output: 'server'`
in `astro.config.mjs`, config in `wrangler.jsonc`). All pages live under `src/pages/[locale]/` for
i18n (en, es). Astro middleware (`src/middleware.ts`) redirects bare paths to the user's preferred
locale, reads the theme cookie into `Astro.locals`, and sets security headers (formerly in
`vercel.json`).

Interactive UI is built with **React islands** via `@astrojs/react` (hydrated with `client:*`
directives); everything else is static `.astro`.

### Content Pipeline

Blog posts and projects are **Markdown files with gray-matter frontmatter**, bundled at build time
with `import.meta.glob(..., { query: '?raw', eager: true })` so they work on workerd (no
`node:fs` at request time):

- `src/assets/posts/{en,es}/*.md` - Blog posts
- `src/assets/projects/{en,es}/*.md` - Project pages
- Parsed by `src/lib/blog.ts` and `src/lib/projects.ts` using `gray-matter` + `remark` + `remark-html`
- Posts with `isDraft: true` in frontmatter are excluded in production (`import.meta.env.PROD`)

### I18n

- Locales defined in `src/lib/i18n.ts` as `['en', 'es']` (plus an `isLocale` guard)
- Translation dictionaries: `src/lib/dictionaries/{en,es}.json`
- `src/middleware.ts` uses `negotiator` + `@formatjs/intl-localematcher` for locale detection and redirects
- Astro's built-in i18n routing is intentionally NOT enabled; the `[locale]` param + middleware handle routing (avoids double-prefixing)

### Styling

**Vanilla Extract** (zero-runtime CSS-in-TypeScript) via `@vanilla-extract/vite-plugin`. Shared design system lives in `src/styles/` (`theme.css.ts` tokens + light/dark/responsive themes, `global.css`, and page-level `*.css.ts`). Component-scoped styles are co-located `*.css.ts` files. Fonts come from `@fontsource/inter` and `@fontsource/merriweather`.

### Key Patterns

- **`src/lib/metadata.ts`**: `getMetadata({ locale, ... })` returns resolved SEO fields (title, OG/Twitter, canonical, images); `Layout.astro` renders the `<head>` from it
- **`src/pages/[locale]/[...dynamic].astro`**: Catch-all that redirects social links (github, linkedin, x, cv, email) via `src/lib/social.json`, otherwise renders a 404
- **`src/modules/NftModal/NftModal.tsx`**: React island that intercepts in-app clicks to `/{locale}/nfts/{id}` and shows an overlay; direct visits fall through to `src/pages/[locale]/nfts/[id].astro`
- **API endpoints** live in `src/pages/api/**.ts` (Astro endpoints). Server secrets come from `import { env } from 'cloudflare:workers'` (not `process.env`). Chat uses Workers AI (`env.AI.run`, model `@cf/meta/llama-3.1-8b-instruct`) with the persona Q&A in `src/lib/assistant-training.json`. Algolia cron needs `ALGOLIA_APP_ID`/`ALGOLIA_API_KEY` (index names `cesargdm_{locale}_{mode}`)
- **OG images**: `src/pages/[locale]/**/opengraph-image.png.ts` generate PNGs with `workers-og` (`ImageResponse` + `loadGoogleFont`). Helpers in `src/lib/open-graph.ts`
- **Sitemap**: `src/pages/sitemap.xml.ts`
- **`src/lib/json.ts`**: `readJson<T>()` — `Request`/`Response.json()` is `unknown`; keep the cast here so lint autofix does not strip it at call sites

### Directory Layout

- `src/pages/` - Astro routes (pages + API endpoints)
- `src/layouts/` - `Layout.astro` (html shell, head, Nav/Footer, theme)
- `src/modules/` - Feature-level components (Nav, Footer, Chat, etc.); `.astro` for static, `.tsx` for islands
- `src/components/` - Shared reusable components
- `src/lib/` - Utilities, configs, data fetching
- `src/styles/` - Vanilla Extract theme + shared/page styles + global CSS
- `src/assets/` - Markdown content and static icons

## Code Conventions

- **Bun** as package manager
- React island components use **function declarations** (enforced by ESLint on `.ts`/`.tsx`)
- **Separate type imports** required: `import type { X }` (not inline `import { type X }`)
- Import order is auto-sorted by `eslint-plugin-simple-import-sort`
- No magic numbers except -1, 0, 1, 2 (object-literal properties like `{ status: 400 }` are exempt)
- No `console.log` (ESLint warns)
- Strict accessibility: `jsx-a11y/strict` config (TS/TSX); `.astro` linted with `eslint-plugin-astro`
- Prettier config: `prettier.config.cjs` (extends `prettier-config-cretia` + `prettier-plugin-astro`)
- Deploy target: **Cloudflare Workers** (`wrangler.jsonc`, `compatibility_date` + `nodejs_compat`)
- After changing `wrangler.jsonc`, run `bunx wrangler types` and commit `worker-configuration.d.ts`. Do not hand-write the generated `Env`; add secret names only via the `Cloudflare.Env` augmentation in `src/env.d.ts`

## Cursor Cloud specific instructions

This is a single frontend service (the Astro web app on Cloudflare Workers); there is no separate
backend or database to run. Standard commands are listed under [Commands](#commands) above — use
those rather than duplicating them.

Non-obvious notes for developing here:

- **Package manager is Bun.** Bun is installed at `~/.bun/bin` and is on the `PATH` for interactive
  shells (via `~/.bashrc`). If you invoke it from a non-interactive script and `bun` is not found,
  call it as `~/.bun/bin/bun`. Use `bun install` (matches `bun.lockb` and CI), not `npm`, even
  though a `package-lock.json` is also committed.
- **Dev / preview is workerd, not Node.** `bun dev` and `bun run preview` both run the Cloudflare
  adapter. The root path `/` returns a 302 redirect to a locale prefix (`/en` or `/es`) via
  `src/middleware.ts`, so hit `/en` (or `/es`) directly when checking pages. Port is **4321**.
- **`astro check` is the type checker** (`bun run typecheck`), not `tsc`. Run `bunx astro sync`
  after changing routes/config if editor types get stale. `bun run lint` runs `astro sync` first
  because type-aware ESLint needs `.astro/types.d.ts` (that file is gitignored; CI lint runs
  before `astro check`).
- **Workers AI is always a remote binding.** `bun dev` needs Cloudflare auth with **Workers
  Scripts Edit** (for Wrangler's `workers/subdomain/edge-preview` session) and **Workers AI
  Read/Edit** (for `env.AI.run`). A token that can only call `wrangler whoami` is not enough —
  `/accounts/:id/workers/*` and `/accounts/:id/ai/*` will 403. For unauthenticated local runs,
  set `ASTRO_CF_NO_REMOTE=1` and use **preview** (`bun run build` then
  `ASTRO_CF_NO_REMOTE=1 bun run preview`). Do not rely on `astro dev` in that mode — Vite's
  dep-optimizer can race and 500 on missing `route-cache-*.js`. Chat will return
  `{ error: "An error occurred" }` until `env.AI` is bound. The Wrangler "Edit Cloudflare
  Workers" token template covers Scripts; add **Account → Workers AI → Edit** as well.
- **Secrets live in Wrangler, not `process.env`.** Put them in `.dev.vars` locally or
  `wrangler secret put NAME` in production. Client-exposed Algolia keys still use the Astro
  `PUBLIC_` prefix (`PUBLIC_ALGOLIA_APP_ID`, `PUBLIC_ALGOLIA_SEARCH_API_KEY`) via `import.meta.env`.
  Server-only keys (`ALGOLIA_APP_ID`/`ALGOLIA_API_KEY`, `OPENSEA_API_KEY`, `UNSPLASH_ACCESS_KEY`,
  `SLACK_TOKEN`/`SLACK_USER_ID`, `X_*`) are read from `cloudflare:workers` `env`. Pages/cards that
  depend on these degrade gracefully without the keys — expected locally, not a broken setup.
- **Home-page cards and the footer clock fetch from the production API** (`BASE_URL` in
  `src/lib/constants.ts` is hardcoded to `https://cesargdm.com`). Locally they show production data
  when reachable, or nothing when offline — this is the original behavior. Test the local API
  endpoints directly (e.g. `curl localhost:4321/api/assets`).
- **NFT modal:** soft (in-app) navigation to `/{locale}/nfts/{id}` opens an overlay island; a direct
  visit or refresh renders the full page. Both paths need `OPENSEA_API_KEY` to show real data.
- Some pages embed external content (a GitHub Giscus comments iframe on blog posts, Unsplash images).
  These need network access / keys and are unrelated to environment setup.
