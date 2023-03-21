import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
	siteMetadata: {
		title: `cesargdm`,
		siteUrl: `https://cesargdm.com`,
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		'gatsby-plugin-emotion',

		{
			resolve: 'gatsby-plugin-sharp',
			options: {
				defaults: {
					quality: 70,
					formats: ['auto', 'webp', 'avif'],
					placeholder: 'blurred',
				},
			},
		},

		'gatsby-transformer-sharp',

		'gatsby-transformer-remark',

		'gatsby-plugin-image',

		'gatsby-plugin-react-helmet-async',

		'gatsby-plugin-sitemap',

		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: 'src/assets/images/icon.png',
			},
		},

		// MDX

		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `posts`,
				path: `${__dirname}/src/assets/posts/`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `projects`,
				path: `${__dirname}/src/assets/projects/`,
			},
		},
		{
			resolve: 'gatsby-plugin-mdx',
			options: {
				extensions: [`.mdx`, `.md`],
				gatsbyRemarkPlugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 1200,
						},
					},
				],
			},
		},

		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: './src/assets/images/',
			},
			__key: 'images',
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: './src/pages/',
			},
			__key: 'pages',
		},

		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 800,
						},
					},
				],
			},
		},
	],
}

export default config
