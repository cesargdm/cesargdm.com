import React from 'react'
import { graphql, Link } from 'gatsby'
import slugify from 'slugify'
import { formatDistanceToNowStrict } from 'date-fns'
import styled from 'styled-components'

import Template from '../templates'

const PostsList = styled.ul`
  display: grid;
  auto-flow: column;
  margin-top: 20px;
  gap: 10px;
`

const PostListItem = styled.li`
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    > p {
      font-size: 0.75rem;
      opacity: 0.5;
      font-weight: 500;
    }

    p {
      margin: 0;
    }

    span {
      display: inline-block;
      background-color: var(--colors--border);
      font-size: 0.7rem;
      padding: 2px 5px;
      border-radius: 4px;
    }
  }
`

function Blog({ data: { posts } }: any) {
  return (
    <Template title="Blog">
      <h1>Blog</h1>
      <PostsList>
        {posts.nodes.map((post: any) => (
          <PostListItem key={post.id}>
            <Link
              to={`/${post.frontmatter.type}/${slugify(post.frontmatter.title, {
                lower: true,
                strict: true,
              })}`}
            >
              <div>
                <p>{post.frontmatter.title}</p>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span>{post.frontmatter.lang === 'en' ? '🇬🇧' : '🇪🇸'}</span>
                  {post.frontmatter?.tags?.map((tag: string) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <p>
                {formatDistanceToNowStrict(new Date(post.frontmatter.date), {
                  addSuffix: true,
                })}
              </p>
            </Link>
          </PostListItem>
        ))}
      </PostsList>
    </Template>
  )
}

export default Blog

export const query = graphql`
  query {
    posts: allMdx(
      sort: { order: DESC, fields: frontmatter___date }
      filter: { frontmatter: { type: { eq: "blog" }, draft: { ne: true } } }
    ) {
      nodes {
        id
        frontmatter {
          title
          tags
          type
          date
          lang
        }
      }
    }
  }
`
