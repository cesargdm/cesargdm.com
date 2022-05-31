import React from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer'

import EntryContent from '../components/EntryContent'

import Layout from '.'
// import Layout from '../components/mdx-test-layout'

export default function Project({ data: { mdx } }: any) {
  return (
    <Layout title={mdx.frontmatter.title}>
      <EntryContent>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </EntryContent>
    </Layout>
  )
}

export const query = graphql`
  query getProject($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`
