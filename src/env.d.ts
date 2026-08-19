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
			ALGOLIA_APP_ID?: string
			ALGOLIA_API_KEY?: string
			OPENSEA_API_KEY?: string
			UNSPLASH_ACCESS_KEY?: string
			SLACK_TOKEN?: string
			SLACK_USER_ID?: string
			STRAVA_CLIENT_ID?: string
			STRAVA_CLIENT_SECRET?: string
			STRAVA_REFRESH_TOKEN?: string
		}
	}
}

export {}
