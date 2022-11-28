import React from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer'
import { Globe } from 'react-feather'

import EntryContent from '../components/EntryContent'

import Layout from '.'
// import Layout from '../components/mdx-test-layout'

export default function Project({ data: { mdx } }: any) {
  return (
    <Layout title={mdx.frontmatter.title}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <a
          title="Visit website"
          style={{ color: 'var(--colors--text)' }}
          href={mdx.frontmatter.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe />
        </a>
      </div>
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
        website
      }
    }
  }
`
