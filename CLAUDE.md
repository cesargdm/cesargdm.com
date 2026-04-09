# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Start dev server (localhost:3000)
bun run build        # Production build
bun run typecheck    # TypeScript type checking (tsc --noEmit)
bun run lint         # ESLint with zero warnings (--max-warnings=0)
bun run format:check # Prettier check
bun run format       # Prettier auto-fix

# Full CI check (what integration.yml runs):
bun run format:check && bun run lint && bun run typecheck && bun run build
```

## Architecture

**Next.js 15 App Router** with all routes under `src/app/[locale]/` for i18n (en, es). The middleware (`src/middleware.ts`) auto-redirects bare paths to the user's preferred locale.

### Content Pipeline

Blog posts and projects are **Markdown files with gray-matter frontmatter**, read from the filesystem at build time:

- `src/assets/posts/{en,es}/*.md` - Blog posts
- `src/assets/projects/{en,es}/*.md` - Project pages
- Parsed by `src/lib/blog.ts` and `src/lib/projects.ts` using `gray-matter` + `remark` + `remark-html`
- Posts with `isDraft: true` in frontmatter are excluded in production

### I18n

- Locales defined in `src/lib/i18n.ts` as `['en', 'es']`
- Translation dictionaries: `src/lib/dictionaries/{en,es}.json`
- Middleware uses `negotiator` + `@formatjs/intl-localematcher` for locale detection

### Styling

**Vanilla Extract** (zero-runtime CSS-in-TypeScript). Styles live in `*.css.ts` files co-located with components. Design tokens and theme contract defined in `src/app/theme.css.ts` with light/dark/responsive themes via `createThemeContract`.

### Key Patterns

- **`src/lib/metadata.ts`**: `getMetadata()` higher-order function wraps page-level `generateMetadata` to apply consistent SEO defaults (OG images, Twitter cards, canonical URLs)
- **`src/lib/types.ts`**: `PageProps<T>` type used by all page components - includes `params.locale`
- **`src/app/[locale]/[...dynamic]/page.tsx`**: Catch-all route that redirects social links (github, linkedin, x, cv, email) via `src/lib/social.json`, otherwise shows 404
- **`src/app/[locale]/@modal/`**: Parallel route for NFT modal overlay
- **`src/app/api/assistant/`**: OpenAI Assistants API integration (requires `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID`)
- **`src/app/api/crons/search/`**: Algolia index sync endpoint (requires `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY`); index names follow pattern `cesargdm_{locale}_{env}`

### Directory Layout

- `src/modules/` - Feature-level components (Nav, Footer, Chat, etc.)
- `src/components/` - Shared reusable components
- `src/lib/` - Utilities, configs, data fetching
- `src/assets/` - Markdown content and static icons

## Code Conventions

- **Bun** as package manager
- Named components must use **function declarations** (not arrow functions), enforced by ESLint
- **Separate type imports** required: `import type { X }` (not inline `import { type X }`)
- Import order is auto-sorted by `eslint-plugin-simple-import-sort` with specific group ordering
- No magic numbers except -1, 0, 1, 2
- No `console.log` (ESLint warns)
- Strict accessibility: `jsx-a11y/strict` config
- Prettier config: `prettier-config-cretia`
- ESLint config extends: `eslint-config-cretia`
- Deploy target: **Vercel**
