'use client'

import Image from 'next/image'
import Link from 'next/link'

import { errorPageContainer } from './styles.css'

export default function Error() {
	return (
		<div className={errorPageContainer}>
			<h1>🔥 This is fine</h1>
			<Image height={144} width={300} src="/images/this-is-fine.png" alt="" />
			<p>
				{`Well you just broke the page, or maybe it was already broken. Either way, it's not working.`}
				<Link
					style={{ fontWeight: 'bold', display: 'block', textAlign: 'center' }}
					href="/"
				>
					Go back home
				</Link>
			</p>
		</div>
	)
}
