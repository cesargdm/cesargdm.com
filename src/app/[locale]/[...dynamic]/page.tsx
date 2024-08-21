import Link from 'next/link'
import { redirect } from 'next/navigation'

import social from '@/lib/social.json'
import type { PageProps } from '@/lib/types'

import { notFoundContainer } from '@/app/[locale]/blog/[slug]/styles.css'

export default function Path(
	props: PageProps<{
		params: { dynamic: string }
	}>,
) {
	const { dynamic } = props.params

	if (dynamic in social) {
		redirect(social[dynamic as keyof typeof social].url)
	}

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
