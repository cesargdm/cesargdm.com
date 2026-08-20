import { getPosts } from '@/lib/blog'
import { text } from '@/lib/frontmatter'
import type { Locale } from '@/lib/i18n'
import { getProjects } from '@/lib/projects'

export type SearchDocument = {
	id: string
	url: string
	type: 'post' | 'project' | 'page'
	title: string
	description: string
	/** Lowercased haystack, precomputed so the client does no work per keystroke. */
	haystack: string
}

const PAGES: Record<
	Locale,
	{ path: string; title: string; description: string }[]
> = {
	en: [
		{ path: '', title: 'About', description: 'Who I am and what I build.' },
		{ path: 'blog', title: 'Blog', description: 'Essays and notes.' },
		{
			path: 'projects',
			title: 'Projects',
			description: 'Things I have built.',
		},
		{ path: 'contact', title: 'Contact', description: 'Where to find me.' },
		{ path: 'chat', title: 'AI Chat', description: 'Ask me anything.' },
		{
			path: 'projects/qr-code-generator',
			title: 'QR Code Generator',
			description:
				'Generate a QR code from any text and download it as SVG or PNG.',
		},
	],
	es: [
		{ path: '', title: 'Acerca de', description: 'Quién soy y qué construyo.' },
		{ path: 'blog', title: 'Blog', description: 'Ensayos y notas.' },
		{
			path: 'projects',
			title: 'Proyectos',
			description: 'Cosas que he construido.',
		},
		{ path: 'contact', title: 'Contacto', description: 'Dónde encontrarme.' },
		{
			path: 'chat',
			title: 'Chat IA',
			description: 'Pregúntame lo que quieras.',
		},
		{
			path: 'projects/qr-code-generator',
			title: 'Generador de códigos QR',
			description:
				'Genera un código QR desde cualquier texto y descárgalo en SVG o PNG.',
		},
	],
}

const TITLE_WEIGHT = 10
const DESCRIPTION_WEIGHT = 3
const DEFAULT_LIMIT = 8

function toDocument(
	type: SearchDocument['type'],
	url: string,
	title: string,
	description: string,
	body = '',
): SearchDocument {
	return {
		id: url,
		url,
		type,
		title,
		description,
		haystack: `${title} ${description} ${body}`.toLowerCase(),
	}
}

/**
 * Built at build time and served as a static JSON file. The whole corpus is
 * roughly twenty documents, so shipping it and filtering in the browser is
 * cheaper, faster and more private than a hosted search service — and it can
 * never fall out of sync with the content the way a cron-updated index does.
 */
export function buildSearchIndex(locale: Locale): SearchDocument[] {
	const posts = getPosts(locale).map((post) =>
		toDocument(
			'post',
			`/${locale}/blog/${post.slug}`,
			text(post.data.title, post.slug),
			text(post.data.extract),
			post.content,
		),
	)

	const projects = getProjects(locale).map((project) =>
		toDocument(
			'project',
			`/${locale}/projects/${project.slug}`,
			text(project.data.title, project.slug),
			text(project.data.description),
			`${project.content ?? ''} ${((project.data.tags as string[]) ?? []).join(' ')}`,
		),
	)

	const pages = PAGES[locale].map((page) =>
		toDocument(
			'page',
			`/${locale}${page.path ? `/${page.path}` : ''}`,
			page.title,
			page.description,
		),
	)

	return [...pages, ...projects, ...posts]
}

export function searchDocuments(
	documents: SearchDocument[],
	query: string,
	limit = DEFAULT_LIMIT,
): SearchDocument[] {
	const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

	if (!terms.length) return []

	return documents
		.map((document) => {
			// Every term must appear somewhere; a title hit outranks a body hit.
			let score = 0

			for (const term of terms) {
				if (!document.haystack.includes(term)) return null
				if (document.title.toLowerCase().includes(term)) score += TITLE_WEIGHT
				if (document.description.toLowerCase().includes(term))
					score += DESCRIPTION_WEIGHT
				score += 1
			}

			return { document, score }
		})
		.filter((match): match is { document: SearchDocument; score: number } =>
			Boolean(match),
		)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((match) => match.document)
}
