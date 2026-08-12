/// <reference path="../.astro/types.d.ts" />
/// <reference path="../worker-configuration.d.ts" />

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'

declare global {
	namespace App {
		interface Locals {
			theme: Theme
		}
	}

	// Secrets are set via `wrangler secret put` / `.dev.vars` and are not part of
	// wrangler.jsonc, so declare them here for typing `cloudflare:workers` env.
	namespace Cloudflare {
		interface Env {
			OPENAI_API_KEY?: string
			OPENAI_ASSISTANT_ID?: string
			ALGOLIA_APP_ID?: string
			ALGOLIA_API_KEY?: string
			OPENSEA_API_KEY?: string
			UNSPLASH_ACCESS_KEY?: string
			SLACK_TOKEN?: string
			SLACK_USER_ID?: string
			X_API_KEY?: string
			X_API_KEY_SECRET?: string
			X_ACCESS_TOKEN?: string
			X_ACCESS_TOKEN_SECRET?: string
		}
	}
}

export {}
