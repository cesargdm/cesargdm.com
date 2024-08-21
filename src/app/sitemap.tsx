import type { MetadataRoute } from 'next'

import { getPosts } from '@/lib/blog'
import { BASE_URL } from '@/lib/constants'
import { LOCALES } from '@/lib/i18n'
import { getNfts } from '@/lib/open-sea'
import { getProjects } from '@/lib/projects'

const urls = ['', 'projects', 'blog', 'contact', 'nfts']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [projects, posts, nfts = []] = await Promise.all([
		getProjects(),
		getPosts(),
		getNfts(),
	])

	return urls
		.map((url) => ({
			url: `${BASE_URL}/${url}`,
			lastModified: new Date(),
			alternates: {
				languages: Object.fromEntries(
					LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}/${url}`]),
				),
			},
		}))
		.concat(
			projects.map((project) => ({
				url: `${BASE_URL}/projects/${project.slug}`,
				lastModified:
					typeof project.data.date === 'string'
						? new Date(project.data.date)
						: new Date(),
				alternates: {
					languages: Object.fromEntries(
						LOCALES.map((locale) => [
							locale,
							`${BASE_URL}/${locale}/projects/${project.slug}`,
						]),
					),
				},
			})),
		)
		.concat(
			posts.map((post) => ({
				url: `${BASE_URL}/blog/${post.slug}`,
				lastModified:
					typeof post.data.date === 'string'
						? new Date(post.data.date)
						: new Date(),
				alternates: {
					languages: Object.fromEntries(
						LOCALES.map((locale) => [
							locale,
							`${BASE_URL}/${locale}/blog/${post.slug}`,
						]),
					),
				},
			})),
		)
		.concat(
			nfts.map((nft) => ({
				url: `${BASE_URL}/nfts/ethereum_${nft.contract}_${nft.identifier}`,
				lastModified: new Date(),
				alternates: {
					languages: Object.fromEntries(
						LOCALES.map((locale) => [
							locale,
							`${BASE_URL}/${locale}/nfts/ethereum_${nft.contract}_${nft.identifier}`,
						]),
					),
				},
			})),
		)
}
