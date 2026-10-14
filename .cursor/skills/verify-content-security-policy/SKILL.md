---
name: verify-content-security-policy
description: Verify Content-Security-Policy on cesargdm.com locally (preview) or production. Use after changing src/lib/content-security-policy.ts or public/_headers.
---

# Verify Content-Security-Policy

Policy source of truth: `src/lib/content-security-policy.ts`. The same value is
written on the `/*` rule in `public/_headers` for prerendered pages and static
assets; `src/middleware.ts` imports the export for on-demand routes. After
editing the policy, run `bun scripts/sync-public-headers.mjs` (or rely on
`bun test src/lib/content-security-policy.test.ts`, which fails when they drift).

## Build and serve

```bash
bun run build
bun run preview
```

Preview serves on `http://localhost:4321` with workerd; prerendered HTML uses
`public/_headers` via the static asset layer.

For home cards that depend on build-time secrets (Strava, Unsplash, Slack), put
the same keys in `.dev.vars` before `bun run build` so `/en` and `/es` match
production. CI `build` omits secrets; deploy writes them first.

## Automated browser check (required)

Do not rely on DevTools console filters alone — some breakages are empty UI
slots or failed subresources without a `Refused` line.

```bash
bun run build
bun run preview   # tmux / background
bun scripts/verify-content-security-policy.mjs
```

The script:

- Fails if `public/_headers` and `content-security-policy.ts` disagree
- Registers `securitypolicyviolation` listeners before navigation (init script +
  Playwright handler)
- Records `requestfailed` for every route below
- On `/en` and `/es`, asserts AI Chat and Bluesky copy, **no visible empty home
  card shells**, and when Strava HTML is present (production or a secrets-backed
  build), the Run stat is visible

Against production HTML with the new policy applied to document responses:

```bash
BASE_URL=https://cesargdm.com bun scripts/verify-content-security-policy.mjs
```

## Check response headers

```bash
curl -sI http://localhost:4321/en | rg -i 'content-security-policy|x-frame-options'
```

Expect a `Content-Security-Policy` header whose value matches
`CONTENT_SECURITY_POLICY` from `src/lib/content-security-policy.ts`.

## Routes covered by the script

| Route                                    | Notes                                            |
| ---------------------------------------- | ------------------------------------------------ |
| `/en`, `/es`                             | Home cards, theme script, ClientRouter           |
| `/en/blog`, `/en/blog/modern-moderation` | Giscus on posts                                  |
| `/en/projects`, `/en/projects/c-chess`   | WASM chess                                       |
| `/en/projects/coffee-atlas`              | D3 canvas                                        |
| `/en/projects/photo-mosaic`              | Web Worker + blob URLs                           |
| `/en/projects/cv-review`                 | PDF.js from mozilla.github.io                    |
| `/en/projects/qr-code-generator`         | Canvas                                           |
| `/en/chat`                               | `fetch('/api/assistant')` when remote AI enabled |
| `/en/nfts`                               | OpenSea CDN images                               |
| `/es/projects/...`                       | Spanish tool slugs                               |

## Screenshots (home Run card)

```bash
bun scripts/capture-csp-screenshots.mjs
```

Writes full-page `/en` and `/es` before (production, no CSP) and after
(production HTML + enforced policy) under `cloud-agent-artifacts/csp-screenshots/`.

## Unit test

```bash
bun test src/lib/content-security-policy.test.ts
```

## CI parity

```bash
bun run format:check && bun run lint && bun run typecheck && bun run i18n:check && bun test && bun run build
```
