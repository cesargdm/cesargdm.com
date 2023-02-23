import React from 'react'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet-async'

import Nav from '../modules/Nav'
import Footer from '../modules/Footer'

import './reset.css'
import GlobalStyles from './GlobalStyles'

const Container = styled.main`
	min-height: calc(100vh - var(--sizes--nav_height));
	padding: 10px;
	display: flex;
`

const Content = styled.div`
	max-width: var(--sizes--content_max_width);
	margin: 0 auto;
	width: 100%;
	position: relative;
`

function Template({
	title,
	children,
}: {
	title?: string
	children: React.ReactNode
}) {
	return (
		<>
			<Helmet defaultTitle="cesargdm" titleTemplate="%s | cesargdm">
				<title>{title}</title>
				<meta
					name="description"
					content="Cesar Guadarrama • Web engineer, photographer and web3 • @cesargdm"
				/>
				<meta charSet="utf-8" />
			</Helmet>
			<GlobalStyles />
			<Nav />
			<Container>
				<Content>{children}</Content>
			</Container>
			<Footer />
		</>
	)
}

export default Template
