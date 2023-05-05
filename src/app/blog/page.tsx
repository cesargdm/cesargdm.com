import Link from 'next/link'

import { getPosts } from '@/lib/blog'

import {
	entryDate,
	entryItem,
	entryLink,
	entryTitle,
	entriesList,
} from './styles.css'

export const metadata = {
	title: 'Blog',
}

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
		<div>
			<h1>Blog</h1>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li className={entryItem} key={entry.slug}>
						<Link className={entryLink} href={`/blog/${entry.slug}`}>
							<p className={entryTitle}>{entry.data.title}</p>
							<p className={entryDate}>
								{new Date(entry.data.date).toLocaleDateString()} •{' '}
								{getReadingTime(entry.content)} minutes read
							</p>
							<p>{entry.data.extract}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
