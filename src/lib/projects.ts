import fs from 'node:fs'
import path from 'node:path'

import { remark } from 'remark'
import remarkHtml from 'remark-html'
import grayMatter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), './src/assets/projects')

export function getProjects(language = 'en') {
	const languagePostsDirectory = path.join(postsDirectory, language)

	const fileNames = fs.readdirSync(languagePostsDirectory)

	let allEntries = fileNames.map((fileName) => {
		const slug = fileName.replace(/\.mdx?$/, '')

		const fullPath = path.join(languagePostsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		const grayMatterResult = grayMatter(fileContents)

		return {
			slug,
			...grayMatterResult,
		}
	})

	allEntries = allEntries.sort((a, b) => {
		if (a.data.date < b.data.date) {
			return 1
		} else {
			return -1
		}
	})

	// TODO: sort by date
	return allEntries
}

export async function getProject(language = 'en', slug: string) {
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
