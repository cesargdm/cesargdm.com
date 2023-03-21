import React from 'react'
import styled from '@emotion/styled'

const Container = styled.footer`
	background-color: var(--colors--background-secondary);
	padding: 25px 10px;
`

const Content = styled.div`
	max-width: var(--sizes--content_max_width);
	margin: 0 auto;
	width: 100%;
	text-align: center;
	font-size: 0.9rem;

	ul {
		display: flex;
		justify-content: center;
		gap: 10px;
	}

	p {
		font-size: 0.9rem;
		margin: 0;
	}
	a {
		opacity: 0.8;
		text-decoration: none;
		font-weight: 600;
		min-height: 40px;
		color: inherit;
	}
`

function Footer() {
	return (
		<Container>
			<Content>
				<ul>
					<li>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://github.com/cesargdm"
						>
							GitHub
						</a>
					</li>
					<li>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://500px.com/cesargdm"
						>
							500px
						</a>
					</li>
					<li>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://linkedin.com/in/cesargdm"
						>
							LinkedIn
						</a>
					</li>
					<li>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://twitter.com/cesargdm"
						>
							Twitter
						</a>
					</li>
				</ul>
				<p>
					César Guadarrama © {new Date().getFullYear()}, Illustrations by{' '}
					<a href="https://weshouldbeblue.com">@weshouldbeblue</a>
				</p>
				<p>
					Source code available at{' '}
					<a href="https://www.github.com/cesargdm/cesargdm.com">GitHub</a>
				</p>
			</Content>
		</Container>
	)
}

export default Footer
