import { getPosts } from '@/lib/blog'
import { text } from '@/lib/frontmatter'
import type { Locale } from '@/lib/i18n'
import { getProjects } from '@/lib/projects'
import { getToolKeyByPath, TOOL_PATHS } from '@/lib/tools'

type Entry = { slug: string; data: Record<string, unknown> }

/**
 * Finds the same piece of content in the other locale.
 *
 * Two cases have to be handled separately. Most entries use the same slug in
 * both locales, so the slug alone is enough. A few were translated with a
 * translated slug too — `modern-moderation` is `moderacion-moderna` in Spanish —
 * and those are paired by a `translationKey` field in their frontmatter.
 */
function findCounterpart(
	entries: Entry[],
	slug: string,
	source: Entry | undefined,
): string | undefined {
	const sameSlug = entries.find((entry) => entry.slug === slug)
	if (sameSlug) return sameSlug.slug

	const key = text(source?.data.translationKey)
	if (!key) return undefined

	return entries.find((entry) => text(entry.data.translationKey) === key)?.slug
}

/**
 * The path to switch to for `target`, given where the visitor currently is.
 *
 * Previously this always returned the home page, so switching language from an
 * article threw away the visitor's place entirely. Now it lands on the same
 * article where one exists, the section index where it does not, and only falls
 * back to home for paths with no equivalent at all.
 */
export function getAlternateLocalePath(
	current: Locale,
	target: Locale,
	pathname: string,
): string {
	// `build.format: 'file'` prerenders /en/blog/x as /en/blog/x.html, and the
	// pathname carries that suffix at build time. Left on, the slug never matched
	// an entry, so switching language from an article silently fell back to the
	// section index — and section pages linked to `/es/blog.html`.
	const segments = pathname
		.replace(/\.html$/, '')
		.replace(/^\/|\/$/g, '')
		.split('/')
	const [, section, slug] = segments

	if (!section) return `/${target}`

	// Tools are Astro pages rather than markdown, so `getProjects` cannot see
	// them and the markdown pairing below would drop the visitor on the projects
	// index. Their slugs differ per locale, so they need pairing of their own.
	if (section === 'projects' && slug) {
		const toolKey = getToolKeyByPath(slug)

		if (toolKey) {
			return `/${target}/projects/${TOOL_PATHS[toolKey][target]}`
		}
	}

	if ((section === 'blog' || section === 'projects') && slug) {
		const load = section === 'blog' ? getPosts : getProjects
		const source = load(current).find((entry) => entry.slug === slug)
		const counterpart = findCounterpart(load(target), slug, source)

		// No translation of this entry — the section index keeps the visitor in
		// the same part of the site rather than dumping them on the home page.
		return counterpart
			? `/${target}/${section}/${counterpart}`
			: `/${target}/${section}`
	}

	// Everything else is the same route in both locales.
	return `/${target}/${segments.slice(1).join('/')}`.replace(/\/$/, '')
}
