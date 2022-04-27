import React from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer'

import Layout from '.'
// import Layout from '../components/mdx-test-layout'

export default function Post({ data: { mdx } }: any) {
  return (
    <>
      <Layout title={mdx.frontmatter.title}>
        <h1>{mdx.frontmatter.title}</h1>
        <p style={{ textAlign: 'left', display: 'block', width: '100%' }}>
          {new Date(mdx.frontmatter.date).toLocaleDateString()}
        </p>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </Layout>
    </>
  )
}

export const query = graphql`
  query getPost($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        date
      }
    }
  }
`
