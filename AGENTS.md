# AGENTS.md

Personal site (cesargdm.com): Astro 7 SSR + React 19 islands on Cloudflare Workers, Vanilla Extract
styles, Lingui i18n (`en`, `es`). Single app: no backend service or database to run.

## Commands

Package manager is **Bun** (`bun install`, matches `bun.lockb`). Never npm/yarn/pnpm. In a
non-interactive shell where `bun` is not on PATH (e.g. Cursor Cloud), call `~/.bun/bin/bun`.

```bash
bun dev                  # workerd-backed dev server on localhost:4321 (/ redirects to /en or /es)
bun run build            # Worker + static assets into dist/; needs no Cloudflare credentials
bun run preview          # serve the production build (also workerd)
bun test                 # bun:test, *.test.ts next to the code
bun test src/lib/i18n.test.ts   # single file
bun run typecheck        # astro sync, then tsgo (.ts/.tsx), then astro check (.astro)
bun run lint             # oxlint --type-aware (.ts/.tsx) + eslint (.astro only)
bun run format:check     # oxfmt + prettier (.astro only); `bun run format` fixes
bun run i18n:check       # fails if src/locales/*.po and src/lib/message-ids.ts disagree

# What CI (integration.yml) runs:
bun run format:check && bun run lint && bun run typecheck && bun run i18n:check && bun test && bun run build
```

With Cloudflare auth (`wrangler login`, or `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`):

```bash
ASTRO_CF_REMOTE=1 bun dev   # dev with the real Workers AI binding (chat at /api/assistant)
bunx wrangler types         # regenerate worker-configuration.d.ts after wrangler.jsonc changes
bunx wrangler ai models     # check the chat model id in src/lib/assistant.ts still exists
```

## Merge gate and deploy

- `main` ruleset: PRs only, required checks **Test, Lint Check Format and Types** and **Build Site**
  (branch must be up to date), code-owner review (`@cesargdm`), all review threads resolved.
- Merging to `main` deploys: `.github/workflows/deploy.yml` builds and runs `wrangler deploy`. It also
  rebuilds daily (07:00 UTC) so the prerendered cards refresh. Never run `wrangler deploy` from a branch.
- `routes` (the apex custom domain) are ignored by `wrangler deploy`, because the adapter generates
  its own `dist/server/wrangler.json`. They apply only via `wrangler triggers deploy --config wrangler.jsonc`.
  Keep `workers_dev: true` explicit: `triggers deploy` turns workers.dev off when the key is absent.

## Architecture decisions

- Pages live under `src/pages/[locale]/`; `src/middleware.ts` negotiates the locale and redirects bare
  paths. Astro's built-in i18n routing is intentionally off (it double-prefixes).
- Markdown content (`src/assets/{posts,projects}/{en,es}/*.md`) is bundled with
  `import.meta.glob(..., { query: '?raw', eager: true })`. Never read `node:fs` at request time.
  `isDraft: true` posts are excluded in production.
- Search is a build-time JSON index (`src/lib/search-index.ts`) filtered in the browser. There is no
  search service (README mentions Algolia; that is stale).
- OG images (`opengraph-image.png.ts`, `workers-og`) inline bundled fonts and the avatar. Do not fetch
  them over the network: the font host once started 404ing and every OG image went blank.
- Integrations: components import `src/lib/{goodreads,unsplash,slack,strava,bluesky,open-sea}.ts`
  directly. `/api/*` routes are thin wrappers. Server-side code never fetches the site's own `/api/...`
  over HTTP; browser islands (Chat, NftModal) calling `/api/*` is the intended boundary.
- Coffee Atlas data (`src/lib/coffee/data.ts`) has sourcing rules: follow `docs/coffee-atlas.md`.

## Gotchas

- **Keep pages prerendered** (`export const prerender = true` + `getStaticPaths`). Reading a cookie or
  request header in a page or `Layout.astro` silently makes it dynamic. Theme and the visit greeting
  are applied by inline scripts for this reason.
- **Security headers live in two places**: `src/middleware.ts` (on-demand routes) and `public/_headers`
  (prerendered pages and static assets, where middleware never runs). Change both.
- **Prerendered cards need keys at build time.** Unsplash, OpenSea, Slack and Strava cards render during
  `astro build`, which cannot see `wrangler secret put` values. Wrangler reads `.dev.vars` during the
  build; CI writes repository secrets to `.dev.vars` first. Missing keys hide the card (expected locally).
- **Secrets**: `.dev.vars` locally, `wrangler secret put` in production, read via
  `import { env } from 'cloudflare:workers'` (not `process.env`). Declare names only in the
  `Cloudflare.Env` augmentation in `src/env.d.ts`; never hand-edit `worker-configuration.d.ts`.
- **Every integration failure goes through `logIntegrationFailure`** (`src/lib/log.ts`). They all degrade
  to empty UI, so an unlogged failure looks like "no data"; four stayed broken for months that way.
- **Strava needs `STRAVA_REFRESH_TOKEN`**, not an access token (those expire after six hours).
- **Remote bindings are opt-in** (`ASTRO_CF_REMOTE=1`). Enabling them by default makes `astro build`,
  and so CI, fail without a token. The token needs Workers Scripts Edit + Workers AI Read/Edit.
- **Workers AI model ids get retired** without notice; a retired id 500s every chat request.
- **URLs are unslashed**: `build.format: 'file'` + `trailingSlash: 'never'` + `html_handling:
drop-trailing-slash` must stay in sync, or canonical URLs cost a redirect hop.
- **Web workers bundle without plugins** (`vite.worker.format: 'es'`, empty `worker.plugins`): nothing a
  worker imports may reach a `.css.ts` or `.po` file.

### Lingui (these fail silently, rendering the raw id like `search.title`)

- Macros do not work in `.astro`; call sites use the runtime `t('id')` from `getTranslate(locale)`
  (`src/lib/translate.ts`). Don't switch to `` t`...` ``.
- `explicitIdAsDefault: true` in `lingui.config.ts` is load-bearing.
- Import `.po` files by relative path, not the `@/` alias.
- `lingui extract` sees nothing. Add each new message by hand to both `src/locales/*.po` and
  `src/lib/message-ids.ts`, then run `bun run i18n:check`.
- One `setupI18n` instance per locale (a build renders both in one process); islands take a `locale` prop.

## Code style (beyond what the linters report)

- oxc tools cover `.ts`/`.tsx`; ESLint (`eslint-plugin-astro`, a11y), Prettier and `astro check` exist
  only because oxc cannot handle `.astro`. Do not delete those configs: dropping them fails silently.
- Separate type imports: `import type { X }`, never inline `import { type X }`.
- Import order comes from oxfmt `experimentalSortImports`; run `bun run format` instead of hand-sorting.
- `Response.json()` returns `unknown`: use `readJson<T>()` from `src/lib/json.ts`, so lint autofix does not
  strip call-site casts.
- Components that need interactivity are React islands; everything else is `.astro`.
- Styles are co-located `*.css.ts` (Vanilla Extract); shared tokens in `src/styles/theme.css.ts`.

## Code Review Rules

- Flag any page or layout change that reads cookies/headers (breaks prerendering).
- Flag a security header added to only one of `src/middleware.ts` / `public/_headers`.
- Flag a new `t()` / `getTranslate` id missing from either `.po` file or `message-ids.ts`. Copy in
  `src/lib/*-copy.ts` modules and localized Markdown is a separate, valid system.
- Flag new integration code whose failure path skips `logIntegrationFailure`.
- Flag server-side self-fetches of `/api/*` and `node:fs` at request time.
- Flag hand edits to `worker-configuration.d.ts`, or a `wrangler.jsonc` binding change without the
  regenerated file (`bunx wrangler types`).
