import React from 'react'
import { graphql, Link } from 'gatsby'
import slugify from 'slugify'
import styled from '@emotion/styled'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import Template from '../templates'

const ProjectsList = styled.ul`
	display: grid;
	auto-flow: column;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	margin-top: 20px;
	gap: 20px;
`

const ProjectItem = styled.li`
	--box-shadow__smooth: 0 1px 1px rgba(0, 0, 0, 0.03),
		0 2px 2px rgba(0, 0, 0, 0.03), 0 4px 4px rgba(0, 0, 0, 0.03),
		0 8px 8px rgba(0, 0, 0, 0.03), 0 16px 16px rgba(0, 0, 0, 0.03);
	--box-shadow__smooth_initial: 0 1px 1px rgba(0, 0, 0, 0),
		0 2px 2px rgba(0, 0, 0, 0), 0 4px 4px rgba(0, 0, 0, 0),
		0 8px 8px rgba(0, 0, 0, 0), 0 16px 16px rgba(0, 0, 0, 0);

	a {
		display: flex;
		height: 100%;
		gap: 4px;
		flex-direction: column;
		width: 100%;
		color: inherit;
		text-decoration: none;
		align-items: flex-start;
		justify-content: flex-start;

		&:hover {
			text-decoration-line: none;
		}

		[data-radix-aspect-ratio-wrapper] {
			border: 1px solid var(--colors--border);
			border-radius: 8px;
			overflow: hidden;
			box-shadow: var(--box-shadow__smooth_initial);
			will-change: box-shadow, transform;
			transition: box-shadow 250ms ease, scale 250ms ease;
			margin-bottom: 8px;
		}

		&:hover {
			opacity: 1;

			[data-radix-aspect-ratio-wrapper] {
				box-shadow: var(--box-shadow__smooth);
				scale: 1.03;
			}
		}
	}
`

const Title = styled.p`
	font-size: 1.2rem;
	font-weight: 700;
	line-height: 1;
	margin: 0;
`

const DescriptionP = styled.p`
	margin-bottom: 8px;
	line-height: 1;
`

const TagsContainer = styled.ul`
	display: flex;
	gap: 8px;
	margin-top: auto;
	width: 100%;
	justify-content: flex-end;

	li {
		display: inline-block;
		background-color: var(--colors--border);
		font-size: 0.7rem;
		padding: 2px 5px;
		border-radius: 4px;
		font-weight: 500;
	}
`

function Projects({ data: { projects } }: any) {
	return (
		<Template title="Projects">
			<h1>Projects</h1>
			<ProjectsList>
				{projects.nodes.map((project: any) => {
					const heroImage = getImage(
						project.frontmatter.heroImage?.childImageSharp?.gatsbyImageData,
					)

					return (
						<ProjectItem key={project.id}>
							<Link
								to={`/${project.frontmatter.type}/${slugify(
									project.frontmatter.title,
									{ lower: true, strict: true },
								)}`}
							>
								<AspectRatio.Root
									// eslint-disable-next-line no-magic-numbers
									ratio={16 / 9}
									style={{
										borderRadius: 12,
										overflow: 'hidden',
									}}
								>
									<GatsbyImage
										// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
										image={heroImage!}
										alt=""
									/>
								</AspectRatio.Root>
								<Title>{project.frontmatter.title}</Title>
								<DescriptionP>{project.frontmatter.description}</DescriptionP>
								<TagsContainer>
									{project.frontmatter?.tags?.map((tag: string) => (
										<li key={tag}>{tag}</li>
									))}
								</TagsContainer>
							</Link>
						</ProjectItem>
					)
				})}
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
					heroImage {
						childImageSharp {
							gatsbyImageData(width: 800)
						}
					}
				}
			}
		}
	}
`
