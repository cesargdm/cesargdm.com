import * as React from 'react'
import { Link } from 'gatsby'

import Template from '../templates'

const paragraphStyles = {
	marginBottom: 48,
}

// markup
const NotFoundPage = () => {
	return (
		<Template title="Not found">
			<h1>Page not found</h1>
			<p style={paragraphStyles}>
				Sorry{' '}
				<span role="img" aria-label="Pensive emoji">
					😔
				</span>{' '}
				{`I couldn't find what you were looking for.`}
				<br />
				<Link to="/">Go home</Link>.
			</p>
		</Template>
	)
}

export default NotFoundPage
