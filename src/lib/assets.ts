import { getPosts } from '@/lib/blog'
import type { Locale } from '@/lib/i18n'
import { getProjects } from '@/lib/projects'

/**
 * Reads content directly instead of fetching the site's own `/api/assets` over
 * the public internet. The old round-trip meant previews and local builds read
 * production, and any hiccup surfaced as a missing OG title.
 */
export function getAssets(locale: Locale = 'en') {
	return {
		projects: getProjects(locale, { content: false }),
		posts: getPosts(locale),
	}
}
