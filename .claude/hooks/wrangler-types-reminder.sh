#!/usr/bin/env bash
# PostToolUse: worker-configuration.d.ts is generated from wrangler.jsonc and committed.
set -u
command -v jq >/dev/null || exit 0

file=$(jq -r '.tool_input.file_path // empty')
[ "$(basename -- "$file")" = wrangler.jsonc ] || exit 0

jq -n '{
	hookSpecificOutput: {
		hookEventName: "PostToolUse",
		additionalContext: "wrangler.jsonc changed. If bindings, vars or compatibility settings changed, run `bunx wrangler types` and commit the regenerated worker-configuration.d.ts (never hand-edit it)."
	}
}'
