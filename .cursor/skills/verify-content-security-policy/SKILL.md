---
name: verify-content-security-policy
description: Verify Content-Security-Policy on cesargdm.com locally (preview) or production. Use after changing src/lib/content-security-policy.ts or public/_headers.
---

# Verify Content-Security-Policy

Policy source of truth: `src/lib/content-security-policy.ts` (also mirrored in `public/_headers`).

## Build and serve

```bash
bun run build
bun run preview
```

Preview serves on `http://localhost:4321` with workerd; prerendered HTML uses `public/_headers` via the static asset layer.

## Check response headers

```bash
curl -sI http://localhost:4321/en | rg -i 'content-security-policy|x-frame-options'
```

Expect a `Content-Security-Policy` header whose value matches `CONTENT_SECURITY_POLICY` from `src/lib/content-security-policy.ts`.

## Browser: zero CSP violations

Open DevTools → Console. Filter for `Content Security Policy` or `CSP`.

Routes to hit (en and es home, blog index + one post, projects index + one project, every micro-app, chat, nfts):

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

Record violation count per route (target: **0**).

## Unit test

```bash
bun test src/lib/content-security-policy.test.ts
```

## CI parity

```bash
bun run format:check && bun run lint && bun run typecheck && bun run i18n:check && bun test && bun run build
```
