import Link from 'next/link'

import { notFoundContainer } from '@/app/[locale]/blog/[slug]/styles.css'

export default function NotFound() {
	return (
		<div className={notFoundContainer}>
			<h1>🙈 Not Found</h1>
			<p>
				{`You just hit a project that doesn't exist, or existed and now its dead... the sadness.`}
				<Link href="/">Go back home</Link>
			</p>
		</div>
	)
}
