# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 16 (App Router) personal website. It is a single frontend service; there is
no separate backend or database to run. Standard commands live in `package.json` and `CLAUDE.md`
(`bun dev`, `bun run build`, `bun run typecheck`, `bun run lint`, `bun run format:check`) — use
those rather than duplicating them.

Non-obvious notes for developing here:

- **Package manager is Bun.** Bun is installed at `~/.bun/bin` and is on the `PATH` for interactive
  shells (via `~/.bashrc`). If you invoke it from a non-interactive script and `bun` is not found,
  call it as `~/.bun/bin/bun`. Use `bun install` (matches `bun.lockb` and CI), not `npm`, even
  though a `package-lock.json` is also committed.
- **Dev server:** `bun dev` serves on `http://localhost:3000`. The root path `/` returns a 307
  redirect to a locale prefix (`/en/` or `/es/`) via `src/middleware.ts`, so hit `/en` (or `/es`)
  directly when checking pages. Locales are `en` and `es`.
- **Environment variables are all optional for local dev.** The site and dev server run with no
  `.env` file. Only specific integrations need keys: Algolia search (`NEXT_PUBLIC_ALGOLIA_*`,
  `ALGOLIA_*`), the AI chat assistant (`OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID`), and misc API
  routes (Slack, X, Unsplash, OpenSea). Pages that depend on these (search, `/chat`, some embeds)
  degrade or error without the keys — this is expected locally, not a broken setup.
- **Content is Markdown-driven.** Blog posts and projects are `.md` files under
  `src/assets/{posts,projects}/{en,es}/` with gray-matter frontmatter (`title`, `date`, `extract`,
  optional `isDraft`). Adding a file makes a new page at `/[locale]/blog/<slug>` immediately in dev.
  `isDraft: true` posts are hidden only in production (`NODE_ENV=production`).
- **`@swc/core` postinstall is blocked by Bun and can be ignored.** Next.js compiles with its own
  `@next/swc` binary, so `bun run build` and `bun dev` work without trusting/running that script.
- Some pages embed external content (a GitHub edit-history iframe on blog posts, Unsplash images).
  These fail to load without network access or keys and are unrelated to environment setup.
