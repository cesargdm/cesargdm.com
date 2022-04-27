import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `cesargdm`,
    siteUrl: `https://cesargdm.com`,
  },
  plugins: [
    'gatsby-plugin-styled-components',

    'gatsby-plugin-react-helmet',

    'gatsby-plugin-image',

    'gatsby-plugin-sitemap',

    `gatsby-plugin-vercel`,

    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/images/icon.png',
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Inter:100,200,300,400,500,600,700,800,900`],
        display: 'swap',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',

    // Images

    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/assets/images/',
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
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
  ],
}

export default config
