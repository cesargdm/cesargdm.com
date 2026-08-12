import type { APIRoute } from 'astro'

import { getPosts } from '@/lib/blog'
import { BASE_URL } from '@/lib/constants'
import { LOCALES } from '@/lib/i18n'
import { getNfts } from '@/lib/open-sea'
import { getProjects } from '@/lib/projects'

export const prerender = false

const STATIC_PATHS = ['', 'projects', 'blog', 'contact', 'nfts']

type Entry = {
	loc: string
	lastmod: string
	pathForLocale: (locale: string) => string
}

function renderUrl({ loc, lastmod, pathForLocale }: Entry) {
	const alternates = LOCALES.map(
		(locale) =>
			`<xhtml:link rel="alternate" hreflang="${locale}" href="${pathForLocale(locale)}" />`,
	).join('')

	return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>${alternates}</url>`
}

export const GET: APIRoute = async () => {
	const projects = [...getProjects('en'), ...getProjects('es')]
	const posts = [...getPosts('en'), ...getPosts('es')]
	const nfts = (await getNfts()) ?? []

	const now = new Date().toISOString()

	const entries: Entry[] = [
		...STATIC_PATHS.map((path) => ({
			loc: `${BASE_URL}/${path}`,
			lastmod: now,
			pathForLocale: (locale: string) => `${BASE_URL}/${locale}/${path}`,
		})),
		...projects.map((project) => {
			const date =
				typeof project.data.date === 'string'
					? new Date(project.data.date)
					: new Date()

			return {
				loc: `${BASE_URL}/projects/${project.slug}`,
				lastmod: date.toISOString(),
				pathForLocale: (locale: string) =>
					`${BASE_URL}/${locale}/projects/${project.slug}`,
			}
		}),
		...posts.map((post) => {
			const date =
				typeof post.data.date === 'string'
					? new Date(post.data.date)
					: new Date()

			return {
				loc: `${BASE_URL}/blog/${post.slug}`,
				lastmod: date.toISOString(),
				pathForLocale: (locale: string) =>
					`${BASE_URL}/${locale}/blog/${post.slug}`,
			}
		}),
		...nfts.map((nft) => {
			const id = `ethereum_${nft.contract}_${nft.identifier}`

			return {
				loc: `${BASE_URL}/nfts/${id}`,
				lastmod: now,
				pathForLocale: (locale: string) => `${BASE_URL}/${locale}/nfts/${id}`,
			}
		}),
	]

	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries
		.map(renderUrl)
		.join('')}</urlset>`

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' },
	})
}
