import React from 'react'
import { graphql, Link } from 'gatsby'
import slugify from 'slugify'
import styled from 'styled-components'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'

import Template from '../templates'

const ProjectsList = styled.ul`
	display: grid;
	auto-flow: column;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	margin-top: 20px;
	gap: 20px;
`

const ProjectItem = styled.li`
	a {
		display: flex;
		gap: 4px;
		flex-direction: column;
		width: 100%;
		color: inherit;
		text-decoration: none;

		p {
			margin: 0;
			b {
				font-size: 1.2rem;
				font-weight: 700;
			}
		}

		> div {
			display: flex;
			gap: 8px;

			span {
				display: inline-block;
				background-color: var(--colors--border);
				font-size: 0.7rem;
				padding: 2px 5px;
				border-radius: 4px;
			}
		}
	}
`

function Projects({ data: { projects } }: any) {
	return (
		<Template title="Projects">
			<h1>Projects</h1>
			<ProjectsList>
				{projects.nodes.map((project: any) => (
					<ProjectItem key={project.id}>
						<Link
							to={`/${project.frontmatter.type}/${slugify(
								project.frontmatter.title,
								{ lower: true, strict: true },
							)}`}
						>
							<AspectRatio.Root
								ratio={16 / 9}
								style={{
									borderRadius: 12,
									overflow: 'hidden',
								}}
							>
								<img
									style={{
										backgroundColor: 'gray',
										width: '100%',
										height: '100%',
									}}
									src=""
									alt=""
								/>
							</AspectRatio.Root>
							<p>
								<b>{project.frontmatter.title}</b>
							</p>
							<p>{project.frontmatter.description}</p>
							<div>
								{project.frontmatter?.tags?.map((tag: string) => (
									<span key={tag}>{tag}</span>
								))}
							</div>
						</Link>
					</ProjectItem>
				))}
			</ProjectsList>
		</Template>
	)
}

export default Projects

export const query = graphql`
	query {
		projects: allMdx(
			sort: { frontmatter: { date: DESC } }
			filter: { frontmatter: { type: { eq: "projects" }, draft: { ne: true } } }
		) {
			nodes {
				id
				frontmatter {
					title
					type
					tags
					description
				}
			}
		}
	}
`
