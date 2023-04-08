import React from 'react'
import styled from '@emotion/styled'
import {
	IconWand,
	IconQrcode,
	IconBrandGithub,
	IconBrandTwitter,
	IconBrandLinkedin,
} from '@tabler/icons-react'
import { Link } from 'gatsby'

const Container = styled.footer`
	background-color: var(--colors--background-secondary);
	padding: 25px 10px;
`

const Content = styled.div`
	max-width: var(--sizes--content_max_width);
	margin: 0 auto;
	width: 100%;
	font-size: 0.9rem;
	padding-right: env(safe-area-inset-right);
	padding-left: env(safe-area-inset-left);
	display: flex;

	> * {
		flex-basis: 33%;
	}

	p {
		font-size: 0.9rem;
		margin: 0;
	}

	a {
		opacity: 0.8;
		text-decoration: none;
		font-weight: 600;
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
				<ul style={{ display: 'flex', flexDirection: 'column' }}>
					<li>
						<Link to="/ai-ask/">
							<IconWand />
							AI Ask
						</Link>
					</li>
					<li>
						<Link to="/qrcode-generator/">
							<IconQrcode />
							QR Code Generator
						</Link>
					</li>
					{/* <li>
						<Link to="/nft-to-go/">
							<IconBolt />
							NFT to Go
						</Link>
					</li> */}
				</ul>

				<div style={{ textAlign: 'center' }}>
					<p style={{ marginBottom: 'var(--spaces--small)' }}>
						César Guadarrama © {new Date().getFullYear()}, Illustrations by{' '}
						<a href="https://mariaazuli.com">@mariaazuli</a>
					</p>
					<p>
						Source code available at{' '}
						<a href="https://www.github.com/cesargdm/cesargdm.com">GitHub</a>
					</p>
				</div>
				<ul style={{ textAlign: 'right' }}>
					{SOCIAL.map(({ icon: Icon, ...social }) => (
						<li key={social.title}>
							<a target="_blank" rel="noopener noreferrer" href={social.url}>
								{social.title}
								<Icon aria-hidden />
							</a>
						</li>
					))}
				</ul>
			</Content>
		</Container>
	)
}

export default Footer
