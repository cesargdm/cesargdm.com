import Link from 'next/link'

import { notFoundContainer } from './styles.css'

export default function NotFound() {
	return (
		<div className={notFoundContainer}>
			<h1>🙈 Not Found</h1>
			<p>
				{`You just hit a post that doesn't exist, or existed and now its gone... the sadness.`}
				<Link href="/">Go back home</Link>
			</p>
		</div>
	)
}
