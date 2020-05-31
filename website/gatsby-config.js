const path = require('path')

const { NODE_ENV = 'development' } = process.env

if (NODE_ENV === 'development') {
  require('dotenv').config({
    path: path.resolve(`.env.local`),
  })
}

const {
  SANITY_API_TOKEN,
  GATSBY_SANITY_PROJECT_ID,
  GATSBY_SANITY_DATASET,
  GOOGLE_ANALYTICS_TRACKING_ID,
} = process.env

module.exports = {
  plugins: [
    'gatsby-plugin-netlify-cache',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: GOOGLE_ANALYTICS_TRACKING_ID,
      },
    },
    {
      resolve: `gatsby-source-sanity`,
      options: {
        watchMode: true,
        overlayDrafts: true,
        projectId: GATSBY_SANITY_PROJECT_ID,
        dataset: GATSBY_SANITY_DATASET,
        token: SANITY_API_TOKEN,
      },
    },
  ],
}
