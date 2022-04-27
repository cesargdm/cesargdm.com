import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Link } from 'gatsby'

const shortcodes = { Link }

function PostLayout({ children }: any) {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>
}

export default PostLayout
