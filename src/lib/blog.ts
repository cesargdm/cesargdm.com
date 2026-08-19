import fs from 'node:fs'
import path from 'node:path'
import grayMatter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

import { byDateDescending } from '@/lib/date'
import { resolveLocaleDirectory } from '@/lib/locale-directory'

const postsDirectory = path.join(process.cwd(), './src/assets/posts')

export function getPosts(language: 'en' | 'es' = 'en') {
	const languagePostsDirectory = resolveLocaleDirectory(
		postsDirectory,
		language,
	)

	const fileNames = fs.readdirSync(languagePostsDirectory)

	let allEntries = fileNames.map((fileName) => {
		const slug = fileName.replace(/\.mdx?$/, '')

		const fullPath = path.join(languagePostsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		const grayMatterResult = grayMatter(fileContents)

		return { slug, ...grayMatterResult }
	})

	allEntries = allEntries.sort(byDateDescending)

	// Remove draft posts in production
	if (process.env.NODE_ENV === 'production') {
		allEntries = allEntries.filter((post) => !post.data.isDraft)
	}

	return allEntries
}

export async function getPost(
	language: Parameters<typeof getPosts>[0],
	slug: string,
) {
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
