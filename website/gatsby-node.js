const path = require('path')

const LOCALES = ['en', 'es']
const MAIN_LOCALE = 'en'

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const {
    data: {
      pages: { nodes: pages },
      gallery: { nodes: gallery },
    },
  } = await graphql(`
    query {
      pages: allSanityPage {
        nodes {
          _id
          slug
        }
      }

      gallery: allSanityGallery {
        nodes {
          _id
          slug
        }
      }
    }
  `)

  LOCALES.forEach((locale) => {
    const localePrefix = MAIN_LOCALE === locale ? '/' : `/${locale}/`

    // Create pages
    pages.forEach(({ slug, _id }) => {
      createPage({
        path: `${localePrefix}${slug ? slug : ''}`,
        component: path.resolve(`./src/templates/Page/index.tsx`),
        context: {
          _id,
          slug,
          localePrefix,
          locale,
        },
      })
    })

    // Create galleries pages
    gallery.forEach(({ slug, _id }) => {
      createPage({
        path: `${localePrefix}${locale === 'en' ? 'photos' : 'fotos'}/${
          slug ? slug : ''
        }`,
        component: path.resolve(`./src/templates/Gallery/index.tsx`),
        context: {
          _id,
          slug,
          localePrefix,
          locale,
        },
      })
    })
  })
}
