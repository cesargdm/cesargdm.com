# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Commands

```bash
bun dev              # Start workerd-backed Astro dev server (localhost:4321)
bun run build        # Production build (Astro + Cloudflare adapter)
bun run preview      # Preview the production build locally (also workerd)
bun run typecheck    # tsgo (ts/tsx) + astro check (.astro)
bun run lint         # oxlint (ts/tsx) + eslint (.astro), warnings are errors
bun run format:check # oxfmt (everything) + prettier (.astro)
bun run format       # same, auto-fixing
bun run i18n:check   # Fail if src/locales/*.po and src/lib/message-ids.ts disagree

# Full CI check (what integration.yml runs):
bun run format:check && bun run lint && bun run typecheck && bun run i18n:check && bun run build
```

`bun run build` needs no Cloudflare credentials — remote bindings are opt-in (see below), so CI
builds without a token. Chat (`/api/assistant`) will 500 locally until the `AI` binding is bound.

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
- `src/middleware.ts` uses `negotiator` + `@formatjs/intl-localematcher` for locale detection and redirects
- Astro's built-in i18n routing is intentionally NOT enabled; the `[locale]` param + middleware handle routing (avoids double-prefixing)

Copy is translated with **Lingui**, driven from `getTranslate(locale)` in `src/lib/translate.ts`:

- Catalogs are `src/locales/{en,es}.po`, compiled on import by `@lingui/vite-plugin`
- `src/lib/message-ids.ts` declares every id, so `t()` takes a checked argument rather than any string
- `bun run i18n:check` (in CI) fails on drift: an id with no translation, or a catalog entry whose id is gone
- One `setupI18n` instance per locale, not a shared `activate()` — a build renders both locales in the same process
- Islands take a `locale` prop and call `getTranslate` themselves; both catalogs ship in one ~10KB client chunk

Three things about this setup fail **silently** — the page renders the id verbatim (`<h1>search.title</h1>`) with nothing thrown:

- **Macros do not work in `.astro` files.** The Astro compiler consumes frontmatter before any Vite-level Babel transform sees it, so call sites use the runtime `t('id')` form. Do not "fix" a call site by reaching for `` t`...` ``
- **`explicitIdAsDefault: true` on the PO formatter is load-bearing** (`lingui.config.ts`). Without it each `msgid` is read as source text and compiled to a content hash, so every lookup by key misses
- **`.po` files must be imported by relative path**, not the `@/` alias — through the alias the id stops matching the plugin's `.po` filter and the named export comes back `undefined`

Since the extractor cannot see runtime calls, `lingui extract` reports nothing; add new messages by hand to both `.po` files and to `message-ids.ts`, then run `bun run i18n:check`.

### Styling

**Vanilla Extract** (zero-runtime CSS-in-TypeScript) via `@vanilla-extract/vite-plugin`. Shared design system lives in `src/styles/` (`theme.css.ts` tokens + light/dark/responsive themes, `global.css`, and page-level `*.css.ts`). Component-scoped styles are co-located `*.css.ts` files. Fonts come from `@fontsource-variable/inter` and `@fontsource-variable/merriweather`.

### Key Patterns

- **`src/lib/metadata.ts`**: `getMetadata({ locale, ... })` returns resolved SEO fields (title, OG/Twitter, canonical, images); `Layout.astro` renders the `<head>` from it
- **`src/pages/[locale]/[...dynamic].astro`**: Catch-all that redirects social links (github, linkedin, x, cv, email) via `src/lib/social.json`, otherwise renders a 404
- **`src/modules/NftModal/NftModal.tsx`**: React island that intercepts in-app clicks to `/{locale}/nfts/{id}` and shows an overlay; direct visits fall through to `src/pages/[locale]/nfts/[id].astro`
- **API endpoints** live in `src/pages/api/**.ts` (Astro endpoints). Server secrets come from `import { env } from 'cloudflare:workers'` (not `process.env`). Chat uses Workers AI (`env.AI.run`, model in `src/lib/assistant.ts` — check it against `wrangler ai models`, IDs get retired). Its system prompt is generated from the site's own projects and posts, so it stays current as content changes
- **Search** is a build-time JSON index (`src/lib/search-index.ts`, served from `/{locale}/search-index.json`) filtered in the browser. No search service, no cron, no keys
- **OG images**: `src/pages/[locale]/**/opengraph-image.png.ts` generate PNGs with `workers-og`. Fonts and the avatar are bundled (`src/assets/fonts`, `src/assets/avatar.png`) and inlined, so rendering an OG image makes no network calls — they used to be fetched, and the font host started 404ing, which silently produced empty images
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

## Toolchain

`oxlint`, `oxfmt` and `tsgo` cover `.ts`/`.tsx`, matching the setup in the TOLO monorepo.
ESLint, Prettier and the `typescript` package are still installed, each scoped to `.astro`
only, because none of the oxc tools can cover those files yet:

- **oxfmt has no `.astro` parser** — it treats the files as excluded, so Prettier still
  formats them (`prettier.config.cjs` keeps the same tabs/quotes/semicolon settings so the
  two formatters agree)
- **oxlint reads `.astro` only as far as its `<script>` block**, so it never sees the
  markup. Most of this site's HTML is `.astro` templates, and `eslint.config.mjs` — now
  reduced to `eslint-plugin-astro` and nothing else — is what keeps a11y enforced on them
- **`tsgo` cannot parse `.astro`**; `astro check` does

Do not "simplify" by deleting the ESLint or Prettier configs. Each one is load-bearing for
a file type oxc does not handle, and dropping them fails silently rather than loudly.

## Code Conventions

- **Bun** as package manager
- React island components use **function declarations** (enforced by oxlint on `.ts`/`.tsx`)
- **Separate type imports** required: `import type { X }` (not inline `import { type X }`)
- Import order is auto-sorted by oxfmt's `experimentalSortImports` (`.oxfmtrc.json`), not by a lint rule
- No magic numbers except -1, 0, 1, 2 (object-literal properties like `{ status: 400 }` are exempt)
- No `console.log` (`console.warn`/`console.error` are allowed)
- Strict accessibility: oxlint's `jsx-a11y` plugin on TS/TSX; `.astro` markup via `eslint-plugin-astro`
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
- **Two type checkers, by necessity.** `tsgo` (TypeScript 7, from `@typescript/native-preview`)
  handles `.ts`/`.tsx`; `astro check` handles `.astro`, and it still needs the 6.x `typescript`
  package, which is why both are installed. `bun run typecheck` runs `astro sync` first — without
  the generated `.astro/types.d.ts`, `tsgo` cannot resolve `astro:*` modules, `import.meta.glob`
  or `?inline` imports.
- **Remote bindings are opt-in.** `remoteBindings` in `astro.config.mjs` is off unless
  `ASTRO_CF_REMOTE=1`. Enabling it starts a proxy session that requires Cloudflare auth, which
  made `astro build` — and therefore CI — fail without a token. The deployed Worker gets the real
  `AI` binding from `wrangler.jsonc` regardless; the flag only affects local dev. To exercise
  Workers AI from `astro dev`, run `ASTRO_CF_REMOTE=1 bun dev` with a token carrying **Workers
  Scripts Edit** and **Workers AI Read/Edit** — `wrangler whoami` access alone 403s.
- **Workers AI model IDs get retired.** `@cf/meta/llama-3.1-8b-instruct` vanished from the catalog
  and the chat 500'd on every request. Check `wrangler ai models` before trusting one.
- **Most pages are prerendered** (`export const prerender = true` + `getStaticPaths`), so they are
  served as static assets and never invoke the Worker. Keep it that way: reading a cookie or a
  request header in a page or the layout silently makes it dynamic. The theme and the visit-count
  greeting are applied by inline scripts for exactly this reason.
- **Security headers live in two places** — `src/middleware.ts` for on-demand routes and
  `public/_headers` for prerendered pages and static assets. Middleware does not run for static
  assets, so a header added to only one of them ships half the site bare.
- **Prerendered cards need their keys at BUILD time, not just on the Worker.** The keyed
  cards (Unsplash, OpenSea, Slack, Strava) are rendered during `astro build`, which runs on your
  machine or in CI — it cannot see `wrangler secret put` values. Wrangler reads `.dev.vars` during
  the build, so the keys must be there too (and in CI, as repository secrets written to `.dev.vars`
  before `bun run build` — see `.github/workflows/deploy.yml`). Setting only the Worker secret
  leaves the card blank in the HTML while the API route works, which looks like a broken card.
- **Secrets live in Wrangler, not `process.env`.** Put them in `.dev.vars` locally or
  `wrangler secret put NAME` in production, and declare them in the `Cloudflare.Env` augmentation in
  `src/env.d.ts`. Current set: `OPENSEA_API_KEY`, `UNSPLASH_ACCESS_KEY`, `SLACK_TOKEN`/
  `SLACK_USER_ID`, `STRAVA_CLIENT_ID`/`STRAVA_CLIENT_SECRET`/`STRAVA_REFRESH_TOKEN`. Cards degrade
  to hidden without their keys — expected locally, not a broken setup.
- **Integrations call their library directly, never the site's own API over HTTP.** Widgets import
  from `src/lib/{goodreads,unsplash,slack,strava,bluesky,open-sea}.ts`; the `/api/*` routes are thin
  wrappers over the same functions. Fetching `${BASE_URL}/api/...` from a component was the old
  pattern and it meant previews read production and every render paid a round trip.
- **Every integration failure must go through `logIntegrationFailure`.** These all degrade to empty
  UI, so an unlogged failure is indistinguishable from "no data" — which is how four of them stayed
  broken in production for months.
- **Strava needs a refresh token, not an access token.** Strava access tokens expire after six
  hours; the lib exchanges `STRAVA_REFRESH_TOKEN` per request and caches the result.
- **NFT modal:** soft (in-app) navigation to `/{locale}/nfts/{id}` opens an overlay island; a direct
  visit or refresh renders the full page. Both paths need `OPENSEA_API_KEY` to show real data.
- Some pages embed external content (a GitHub Giscus comments iframe on blog posts, Unsplash images).
  These need network access / keys and are unrelated to environment setup.
