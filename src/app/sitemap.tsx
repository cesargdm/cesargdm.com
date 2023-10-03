import type { MetadataRoute } from 'next'

import { getPosts } from '@/lib/blog'
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
			url: `https://cesargdm.com/${url}`,
			lastModified: new Date(),
		}))
		.concat(
			projects.map((project) => ({
				url: `https://cesargdm.com/projects/${project.slug}`,
				lastModified: project.data.date
					? new Date(project.data.date)
					: new Date(),
			})),
		)
		.concat(
			posts.map((post) => ({
				url: `https://cesargdm.com/blog/${post.slug}`,
				lastModified: post.data.date ? new Date(post.data.date) : new Date(),
			})),
		)
		.concat(
			nfts.map((nft) => ({
				url: `https://cesargdm.com/nfts/${nft.asset_contract.chain_identifier}_${nft.asset_contract.address}_${nft.token_id}`,
				lastModified: new Date(),
			})),
		)
}
