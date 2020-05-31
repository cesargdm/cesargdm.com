const path = require('path')

const { NODE_ENV = 'development' } = process.env

if (NODE_ENV === 'development') {
  require('dotenv').config({
    path: path.resolve(`.env.local`),
  })
}

const { SANITY_API_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET } = process.env

module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: `gatsby-source-sanity`,
      options: {
        watchMode: true,
        overlayDrafts: true,
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
        token: SANITY_API_TOKEN,
      },
    },
  ],
}
