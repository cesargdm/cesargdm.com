import React from 'react'
import { graphql, Link } from 'gatsby'
import slugify from 'slugify'

import Template from '../templates'

function Projects({ data: { projects } }: any) {
  return (
    <Template title="Projects">
      <h1>Projects</h1>
      {projects.nodes.map((project: any) => (
        <Link
          key={project.id}
          to={`/${project.frontmatter.type}/${slugify(
            project.frontmatter.title,
            { lower: true, strict: true },
          )}`}
        >
          <h2>{project.frontmatter.title}</h2>
          <p>{project.frontmatter.date}</p>
          <p>{project.excerpt}</p>
        </Link>
      ))}
    </Template>
  )
}

export default Projects

export const query = graphql`
  query {
    projects: allMdx(
      sort: { order: DESC, fields: frontmatter___date }
      filter: { frontmatter: { type: { eq: "projects" } } }
    ) {
      nodes {
        id
        frontmatter {
          title
          type
          title
        }
      }
    }
  }
`
