import Link from 'next/link'

import { getPosts } from '@/lib/blog'
import { getHumanReadableDate } from '@/lib/date'
import { getMetadata } from '@/lib/metadata'

import {
	entriesList,
	entryDate,
	entryItem,
	entryLink,
	entryTitle,
} from './styles.css'

export const metadata = getMetadata({
	title: 'Blog',
	description: 'César Guadarrama Cantú - Product engineer - Blog',
	alternates: { canonical: '/blog' },
})

function getReadingTime(content: string) {
	const wordsPerMinute = 200
	const words = content.split(/\s/g).length
	const minutes = words / wordsPerMinute
	const readTime = Math.ceil(minutes)

	return readTime
}

export default function Blog() {
	const entries = getPosts('en')

	return (
		<>
			<h1>Blog</h1>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li key={entry.slug} className={entryItem}>
						<Link className={entryLink} href={`/blog/${entry.slug}`}>
							<p className={entryTitle}>{entry.data.title}</p>
							<p className={entryDate}>
								{getHumanReadableDate(entry.data.date)} •{' '}
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
