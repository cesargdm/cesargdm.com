@AGENTS.md

## Claude-specific

- Browser QA: use Argent against a Chromium CDP target (Safari in a booted iOS simulator for touch). This is a website; there is no Metro or mobile build.
- A PostToolUse hook (`.claude/hooks/wrangler-types-reminder.sh`) reminds you to run `bunx wrangler types` after editing `wrangler.jsonc`.
