import grayMatter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

import { byDateDescending } from '@/lib/date'
import type { Locale } from '@/lib/i18n'

// Markdown is bundled at build time via import.meta.glob so it works on the
// Cloudflare Workers runtime (no filesystem access at request time).
const rawPosts = import.meta.glob('../assets/posts/*/*.md', {
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
	return Object.entries(rawPosts)
		.filter(([path]) => path.includes(`/posts/${language}/`))
		.map(([path, raw]) => {
			const slug = (path.split('/').pop() ?? '').replace(/\.mdx?$/, '')
			const { data, content } = grayMatter(raw)
			return { slug, data, content }
		})
}

export function getPosts(language: Locale = 'en') {
	let allEntries = parseEntries(language)

	allEntries = allEntries.sort(byDateDescending)

	// Remove draft posts in production
	if (import.meta.env.PROD) {
		allEntries = allEntries.filter((post) => !post.data.isDraft)
	}

	return allEntries
}

export async function getPost(language: Locale, slug: string) {
	const posts = getPosts(language)

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
