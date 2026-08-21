/**
 * Every message id the site uses, and the single source of truth for them.
 *
 * Lingui's extractor cannot build this list: its macros do not run inside
 * `.astro` frontmatter — the Astro compiler consumes it before any Babel
 * transform could — so every call site uses the runtime `t('id')` form, which
 * the extractor is blind to. Declaring the ids here instead buys back what the
 * extractor would have given: `t()` only accepts a known id, and
 * `bun run i18n:check` fails if `src/locales/*.po` and this list drift apart.
 */
export const MESSAGE_IDS = [
	'nav.blog',
	'nav.projects',
	'nav.search.label',
	'nav.search.close',
	'nav.search.placeholder',
	'nav.search.empty',
	'nav.search.hint',
	'nav.theme.toggle',
	'nav.skipToContent',
	'footer.copyright',
	'footer.source',
	'footer.localTime',
	'footer.viewInSpanish',
	'footer.viewInEnglish',
	'blog.title',
	'blog.description',
	'blog.readingTime',
	'projects.title',
	'projects.description',
	'projects.metaDescription',
	'projects.tools',
	'chat.title',
	'chat.description',
	'chat.metaDescription',
	'chat.greeting',
	'chat.placeholder',
	'chat.loading',
	'chat.send',
	'chat.empty',
	'chat.error',
	'search.title',
	'search.metaDescription',
	'search.label',
	'search.placeholder',
	'search.hint',
	'search.results',
	'nfts.title',
	'nfts.metaDescription',
	'nfts.empty',
	'notFound.title',
	'notFound.description',
	'notFound.home',
	'notFound.post',
	'notFound.project',
	'notFound.backToNfts',
	'share.x',
	'share.linkedin',
	'aside.description',
	'aside.share',
	'aside.avatarAlt',
] as const

export type MessageId = (typeof MESSAGE_IDS)[number]
