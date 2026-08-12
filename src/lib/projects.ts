import grayMatter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

import type { Locale } from '@/lib/i18n'

// Markdown is bundled at build time via import.meta.glob so it works on the
// Cloudflare Workers runtime (no filesystem access at request time).
const rawProjects = import.meta.glob('../assets/projects/*/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
})

type Entry = {
	slug: string
	data: Record<string, unknown>
	content: string
}

function parseEntries(language: Locale): Entry[] {
	return Object.entries(rawProjects)
		.filter(([path]) => path.includes(`/projects/${language}/`))
		.map(([path, raw]) => {
			const slug = (path.split('/').pop() ?? '').replace(/\.mdx?$/, '')
			const { data, content } = grayMatter(raw)
			return { slug, data, content }
		})
}

export function getProjects(
	language: Locale = 'en',
	options: { content: boolean } = { content: true },
) {
	let allEntries = parseEntries(language).map((entry) =>
		options.content ? entry : { ...entry, content: '' },
	)

	// Sort by date
	allEntries = allEntries.sort((a, b) => {
		const aDate = a.data.date as string
		const bDate = b.data.date as string
		if (aDate < bDate) return 1
		if (aDate > bDate) return -1
		return 0
	})

	// Remove draft posts in production
	if (import.meta.env.PROD) {
		allEntries = allEntries.filter((post) => !post.data.isDraft)
	}

	return allEntries
}

export async function getProject(language: Locale, slug: string) {
	const posts = getProjects(language)

	const post = posts.find((post) => post.slug === slug)

	if (!post) return null

	const processedContent = await remark()
		.use(remarkHtml)
		.process(post.content || '')

	const contentHtml = processedContent.toString()

	return {
		slug: post.slug,
		data: post.data,
		contentHtml,
	}
}
