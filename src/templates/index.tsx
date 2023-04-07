import React, { type ReactElement } from 'react'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet-async'

import Nav from '../modules/Nav'
import Footer from '../modules/Footer'

import './reset.css'
import './main.css'

const Container = styled.main`
	min-height: 100vh;
	padding: 10px;
	padding-top: var(--sizes--nav_height);
	display: flex;
`

const Content = styled.div`
	max-width: var(--sizes--content_max_width);
	margin: 0 auto;
	width: 100%;
	position: relative;
	padding-right: env(safe-area-inset-right);
	padding-left: env(safe-area-inset-left);

	a {
		color: var(--colors--tint);
		font-weight: 600;
		text-decoration: none;

		&:hover {
			text-decoration-line: underline;
			text-decoration-thickness: 2px;
		}
	}
`

type Props = {
	title?: string
	children: React.ReactNode
}

function Template({ title, children }: Props): ReactElement {
	return (
		<>
			<Helmet
				htmlAttributes={{ lang: 'en-US' }}
				defaultTitle="cesargdm"
				titleTemplate="%s | cesargdm"
			>
				<title>{title}</title>
				<meta
					name="description"
					content="Cesar Guadarrama • Web and product engineer • @cesargdm"
				/>
				<meta
					name="viewport"
					content="initial-scale=1, viewport-fit=cover"
				></meta>
				<meta charSet="utf-8" />
			</Helmet>
			<Nav />
			<Container>
				<Content>{children}</Content>
			</Container>
			<Footer />
		</>
	)
}

export default Template
