import Link from 'next/link'

import { notFoundContainer } from './blog/[slug]/styles.css'

export default function NotFound() {
	return (
		<div className={notFoundContainer}>
			<h1>🙈 Not Found</h1>
			<p>
				{`You just hit a page that doesn't exist... the sadness.`}
				<Link href="/">Go back home</Link>
			</p>
		</div>
	)
}
