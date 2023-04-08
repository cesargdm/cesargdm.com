/* eslint-disable no-console */
import path from 'path'

import slugify from 'slugify'
import fetch from 'node-fetch'

import 'dotenv/config'

const postTemplate = path.resolve(`./src/templates/Post.tsx`)
const projectTemplate = path.resolve(`./src/templates/Project.tsx`)

exports.createPages = async ({ graphql, actions, reporter }: any) => {
	// Destructure the createPage function from the actions object
	const { createPage } = actions

	const allMdxPagesResult = await graphql(`
		query allMdxPages {
			allMdx {
				edges {
					node {
						id
						frontmatter {
							title
							type
						}
						internal {
							contentFilePath
						}
					}
				}
			}
		}
	`)

	if (allMdxPagesResult.errors) {
		reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
	}

	const posts = allMdxPagesResult.data.allMdx.edges

	posts.forEach(({ node }: any) => {
		const { title, type } = node.frontmatter ?? {}

		if (!title || !type) {
			console.error(`Skipping blog post with no title or type: ${node.id}`)
			return
		}

		createPage({
			// The slug generated by gatsby-plugin-mdx doesn't contain a slash at the beginning
			// You can prepend it with any prefix you want
			path: `/${type}/${slugify(node.frontmatter.title, {
				lower: true,
				strict: true,
			})}/`,
			// This component will wrap our MDX content
			component: `${
				type === 'blog' ? postTemplate : projectTemplate
			}?__contentFilePath=${node.internal.contentFilePath}`,

			// You can use the values in this context in
			// our page layout component
			context: { id: node.id },
		})
	})
}

// Source nodes

export const sourceNodes = async ({
	actions: { createNode },
	createContentDigest,
}: any) => {
	const allMdxPagesResult = (await fetch(
		`https://api.opensea.io/api/v1/assets?owner=0xE3a856E4034D25FF68b3702B8f1618173BBFa130&limit=100`,
		{
			method: 'GET',
			headers: {
				'X-API-KEY': process.env.OPENSEA_API_KEY as string,
			},
		},
	).then((res) => res.json())) as {
		assets: ({
			name: string
			last_sale: number
			description: string
			permalink: string
			image_url: string
			id: string
		} & any)[]
	}

	allMdxPagesResult?.assets.forEach((token) => {
		const {
			total_price,
			payment_token: { symbol, decimals } = { symbol: '', decimals: 1 },
		} = token.last_sale ?? {}

		const lastSale =
			isNaN(total_price) || !symbol
				? ''
				: // eslint-disable-next-line no-magic-numbers
				  `${total_price / 10 ** decimals}${symbol}`

		createNode({
			name: token.name,
			lastSale,
			description: token.description,
			permalink: token.permalink,
			imageUrl: token.image_url,
			creator: token.creator,
			collection: token.collection,
			numSales: token.num_sales,
			imageThumbnailUrl: token.image_thumbnail_url,
			// required fields
			id: String(token.id),
			parent: 'allNfts',
			children: [],
			internal: {
				type: `Nft`,
				contentDigest: createContentDigest(token),
			},
		})
	})
}
