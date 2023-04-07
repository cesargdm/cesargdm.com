import React from 'react'
import styled from '@emotion/styled'
import {
	IconBrandGithub,
	IconBrandTwitter,
	IconBrandLinkedin,
} from '@tabler/icons-react'

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
	padding-right: env(safe-area-inset-right);
	padding-left: env(safe-area-inset-left);

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

const SOCIAL = [
	{
		url: 'https://github.com/cesargdm',
		icon: IconBrandGithub,
		title: 'GitHub',
	},
	{
		url: 'https://linkedin.com/in/cesargdm',
		icon: IconBrandLinkedin,
		title: 'LinkedIn',
	},
	{
		url: 'https://twitter.com/cesargdm',
		icon: IconBrandTwitter,
		title: 'Twitter',
	},
] as const

function Footer() {
	return (
		<Container>
			<Content>
				<ul>
					{SOCIAL.map(({ icon: Icon, ...social }) => (
						<li key={social.title}>
							<a target="_blank" rel="noopener noreferrer" href={social.url}>
								<Icon aria-hidden />
								{social.title}
							</a>
						</li>
					))}
				</ul>
				<p>
					César Guadarrama © {new Date().getFullYear()}, Illustrations by{' '}
					<a href="https://mariaazuli.com">@mariaazuli</a>
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
