import Link from 'next/link'

import { getPosts } from '@/lib/blog'
import { getHumanReadableDate } from '@/lib/date'
import { getMetadata } from '@/lib/metadata'
import type { PageProps } from '@/lib/types'

import {
	entriesList,
	entryDate,
	entryItem,
	entryLink,
	entryTitle,
	pageDescription,
} from './styles.css'

export const metadata = getMetadata({
	title: 'Blog',
	description:
		'Read about coding tips, tutorials, programming configurations, thoughts, ideas and more',
	alternates: { canonical: '/blog' },
})

function getReadingTime(content: string) {
	const wordsPerMinute = 200
	const words = content.split(/\s/g).length
	const minutes = words / wordsPerMinute
	const readTime = Math.ceil(minutes)

	return readTime
}

export default function Blog({ params }: PageProps) {
	const entries = getPosts(params.locale)

	return (
		<>
			<h1>Blog</h1>
			<p className={pageDescription}>
				Read about coding tips, tutorials, programming configurations, thoughts,
				ideas and more
			</p>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li key={entry.slug} className={entryItem}>
						<Link
							className={entryLink}
							href={`/${params.locale}/blog/${entry.slug}`}
						>
							<p className={entryTitle}>{entry.data.title}</p>
							<p className={entryDate}>
								{getHumanReadableDate(entry.data.date as string)} •{' '}
								{getReadingTime(entry.content)} minutes read
							</p>
							<p>{entry.data.extract}</p>
						</Link>
					</li>
				))}
			</ul>
		</>
	)
}
