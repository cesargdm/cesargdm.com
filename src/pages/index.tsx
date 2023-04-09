/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import styled from '@emotion/styled'

import Template from '../templates'

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
`

const blankProps = {
	target: '_blank',
	rel: 'noopener noreferrer',
}

function Index() {
	return (
		<Template>
			<Content>
				<h1>Hi!</h1>
				<p>
					I'm a dedicated Product Engineer with a passion for creating
					delightful and functional user experiences. On a daily basis, I work
					my magic 🪄 with TypeScript, crafting seamless user interfaces using
					React, while powering the backend with Node, GraphQL, and MongoDB.
				</p>
				<p>
					I'm working in the awesome startup{' '}
					<a {...blankProps} href="https://www.ocho.co">
						OCHO
					</a>{' '}
					and my side project{' '}
					<a {...blankProps} href="https://www.cretia.app">
						Cretia
					</a>
					; before that I've been part of amazing teams such as{' '}
					<a {...blankProps} href="https://tesorio.com">
						Tesorio
					</a>
					,{' '}
					<a {...blankProps} href="https://myaura.com">
						Aura
					</a>
					,{' '}
					<a {...blankProps} href="https://covalto.com">
						Covalto
					</a>{' '}
					(prev. Credijusto) and <a href="https://ibm.com">IBM</a>. And since I
					cannot sit still, I've done some extra work with with some clients
					like{' '}
					<a {...blankProps} href="https://fucesa.com">
						Fucesa
					</a>
					,{' '}
					<a {...blankProps} href="https://concepthaus.mx/">
						ConceptHaus
					</a>
					.
				</p>
			</Content>
		</Template>
	)
}

export default Index
