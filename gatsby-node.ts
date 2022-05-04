import path from 'path'

import slugify from 'slugify'

exports.createPages = async ({ graphql, actions, reporter }: any) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            frontmatter {
              title
              type
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const posts = result.data.allMdx.edges

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
      component:
        type === 'blog'
          ? path.resolve(`./src/templates/Post.tsx`)
          : path.resolve(`./src/templates/Project.tsx`),
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    })
  })
}
