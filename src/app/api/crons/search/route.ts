import { algoliasearch } from 'algoliasearch'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getAlgoliaIndexName } from '@/lib/algolia/utils'
import { getPosts } from '@/lib/blog'
import type { Locale } from '@/lib/i18n'
import { getProjects } from '@/lib/projects'

const APP_ID = process.env.ALGOLIA_APP_ID as string
const API_KEY = process.env.ALGOLIA_API_KEY as string

const client = APP_ID && API_KEY ? algoliasearch(APP_ID, API_KEY) : undefined

const WEBSITE_PAGES = [
	{
		title: 'Projects',
		url: '/projects',
		slug: 'projects',
	},
	{
		title: 'Blog',
		url: '/blog',
		slug: 'blog',
	},
	{
		title: 'About',
		url: '/',
		slug: '',
	},
	{
		title: 'Contact',
		url: '/contact',
		slug: 'contact',
	},
	{
		title: 'LinkedIn',
		url: '/linkedin',
		slug: 'linkedin',
	},
	{
		title: 'Github',
		url: '/github',
		slug: 'github',
	},
	{
		title: 'Email',
		url: '/email',
		slug: 'email',
	},
	{
		title: 'CV',
		url: '/cv',
		slug: 'cv',
	},
	{
		title: 'X',
		url: '/x',
		slug: 'x',
	},
] as const

export async function GET(request: NextRequest) {
	try {
		if (!client) {
			throw new Error('Algolia client not initialized')
		}

		const locale = (request.nextUrl.searchParams.get('locale') ||
			'en') as Locale

		const projects = getProjects(locale, { content: false })
		const posts = getPosts(locale)
		const indexName = getAlgoliaIndexName(locale)

		const [[pagesIndex], [projectsIndex], [postsIndex]] = await Promise.all([
			await client.saveObjects({
				indexName,
				objects: WEBSITE_PAGES.map((page) => ({
					type: 'page',
					objectID: `page-${page.slug}-${locale}`,
					title: page.title,
					url: `/${locale}${page.url}`,
				})),
			}),
			await client.saveObjects({
				indexName,
				objects: projects.map((project) => ({
					type: 'project',
					objectID: `project-${project.slug}-${locale}`,
					title: project.data.title as string,
					url: `/${locale}/projects/${project.slug}`,
					description: project.data.description as string,
					date: project.data.date as string,
				})),
			}),
			await client.saveObjects({
				indexName,
				objects: posts.map((post) => ({
					type: 'post',
					title: post.data.title as string,
					objectID: `post-${post.slug}-${locale}`,
					url: `/${locale}/blog/${post.slug}`,
					description: post.data.extract as string,
					date: post.data.date as string,
				})),
			}),
		])

		const indexes = [pagesIndex, projectsIndex, postsIndex]

		const result = await Promise.all(
			indexes.map((index) =>
				client.waitForTask({
					indexName,
					taskID: index.taskID,
				}),
			),
		)

		return NextResponse.json({ result, indexes })
	} catch {
		return NextResponse.json(
			{ message: 'Error updating Algolia indexes' },
			{ status: 500 },
		)
	}
}
