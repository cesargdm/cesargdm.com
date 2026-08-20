import { getPosts } from '@/lib/blog'
import { text } from '@/lib/frontmatter'
import type { Locale } from '@/lib/i18n'
import { getProjects } from '@/lib/projects'

/**
 * Cloudflare Workers AI model used for the chat assistant.
 * See `wrangler ai models` for the full catalog.
 */
export const AI_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

export type ChatMessage = {
	role: 'user' | 'assistant'
	content: string
}

/**
 * Facts that are not derivable from the site's own content. Everything else in
 * the prompt is generated from the published projects and posts, so the
 * assistant cannot drift out of date the way the previous hand-maintained Q&A
 * set did.
 *
 * The distinction between employer and personal project matters here — an
 * earlier version stated it backwards and the assistant repeated it.
 */
const BIO = [
	'César Guadarrama Cantú is a product engineer from Toluca, México.',
	'He studied Computer Engineering at Tec de Monterrey and has worked full time since 2019.',
	'He currently works at OCHO, an insurance tech company. Before that: Tesorio, Aura, Covalto and IBM — mostly fintech.',
	'TOLO and Cretia are his own projects, not employers. TOLO is a specialty coffee company he built the whole platform for (point of sale, mobile ordering, and an MCP server that lets AI agents query the business), running on Cloudflare Workers. Cretia is an ERP for Mexican SMEs.',
	'He works mainly in TypeScript with React and React Native, plus Node, GraphQL and Cloudflare Workers.',
	'He has contributed to open source upstream, including Expo, wagmi, React Native Skia, ENS docs and PDFKit.',
	'Outside work he is into specialty coffee, mountain biking, photography and reading.',
	'He is reachable at yo@cesargdm.com, on GitHub as cesargdm, and on Bluesky at cesargdm.com.',
].join('\n')

const cachedPrompts = new Map<Locale, string>()

const PROJECT_EXCERPT_LENGTH = 700
const POST_EXCERPT_LENGTH = 300

/** Markdown reads poorly as prompt context; flatten it to plain prose. */
function toExcerpt(markdown: string, limit: number) {
	const plain = markdown
		.replace(/^#.*$/gm, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`>]/g, '')
		.replace(/\s+/g, ' ')
		.trim()

	return plain.length > limit ? `${plain.slice(0, limit)}…` : plain
}

/**
 * Builds the system prompt from the site's own published content, so the
 * assistant answers about the same projects a visitor can actually read and
 * cannot drift out of date as the content changes.
 */
export function buildSystemPrompt(locale: Locale = 'en'): string {
	const cached = cachedPrompts.get(locale)
	if (cached) return cached

	const projects = getProjects(locale)
		.map((project) => {
			const title = text(project.data.title, project.slug)
			const description = text(project.data.description)
			const body = toExcerpt(project.content ?? '', PROJECT_EXCERPT_LENGTH)

			return `## ${title} — /${locale}/projects/${project.slug}\n${description}\n${body}`
		})
		.join('\n\n')

	const posts = getPosts(locale)
		.map((post) => {
			const title = text(post.data.title, post.slug)
			const extract = text(post.data.extract)
			const body = toExcerpt(post.content ?? '', POST_EXCERPT_LENGTH)

			return `## ${title} — /${locale}/blog/${post.slug}\n${extract}\n${body}`
		})
		.join('\n\n')

	const prompt = [
		'You are César Guadarrama answering visitors on his personal website, cesargdm.com.',
		'Speak in the first person: warm, concise, casual. Keep replies to 1-3 sentences unless asked for detail.',
		locale === 'es' ? 'Answer in Spanish.' : 'Answer in English.',
		'',
		'Everything below is your own knowledge about yourself and your work. Answer from it directly and confidently — never claim you lack context about something described here.',
		'When a project or post is relevant, mention its page path so the visitor can read more.',
		'If a question is genuinely not covered below, say so briefly instead of inventing an answer. Never invent contact details, employers, dates or numbers.',
		'',
		'# About me',
		BIO,
		'',
		'# My projects',
		projects,
		'',
		'# My writing',
		posts,
	].join('\n')

	cachedPrompts.set(locale, prompt)

	return prompt
}
