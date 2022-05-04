import type { GatsbyConfig } from 'gatsby'

const siteUrl = process.env.URL || `https://cesargdm.com`

const config: GatsbyConfig = {
  siteMetadata: {
    title: `cesargdm`,
    siteUrl,
  },
  plugins: [
    'gatsby-plugin-styled-components',

    'gatsby-plugin-react-helmet',

    'gatsby-plugin-image',

    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          allSitePage {
            nodes {
              path
            }
          }
        }
      `,
        resolveSiteUrl: () => siteUrl,
        resolvePages: ({ allSitePage: { nodes: allPages } }: any) => {
          return allPages.map((page: any) => {
            return { ...page }
          })
        },
        serialize: ({ path, modifiedGmt }: any) => {
          return {
            url: path,
            lastmod: modifiedGmt,
          }
        },
      },
    },

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

    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap/sitemap-index.xml`,
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }],
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }],
          },
        },
      },
    },

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
