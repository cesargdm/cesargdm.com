import React from 'react'
import { graphql } from 'gatsby'
import { Globe } from 'react-feather'

import EntryContent from '../components/EntryContent'

import Layout from '.'

export default function Project({ data: { mdx }, children }: any) {
	return (
		<Layout title={mdx.frontmatter.title}>
			<aside
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
			</aside>
			<EntryContent>{children}</EntryContent>
		</Layout>
	)
}

export const query = graphql`
  query getProject($id: String!) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
        website
      }
    }
  }
`
