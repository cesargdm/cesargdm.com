import Image from 'next/image'
import Link from 'next/link'

import { getHumanReadableDate } from '@/lib/date'
import { getMetadata } from '@/lib/metadata'
import { getProjects } from '@/lib/projects'

import {
	entriesList,
	entryDate,
	entryItem,
	entryTitle,
	highlightedEntry,
	projectEntryLink,
} from '../blog/styles.css'

export const metadata = getMetadata({
	title: 'Projects',
	description: 'César Guadarrama Cantú - Product engineer - Projects',
	alternates: { canonical: '/projects' },
})

export default function Blog() {
	const entries = getProjects('en')

	return (
		<div>
			<h1>Projects</h1>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li
						key={entry.slug}
						style={{ backgroundColor: entry.data.highlight?.color }}
						className={entry.data.highlight ? highlightedEntry : entryItem}
					>
						<Link className={projectEntryLink} href={`/projects/${entry.slug}`}>
							<div>
								{!entry.data.highlight?.logoUrl && (
									<p className={entryTitle}>{entry.data.title}</p>
								)}
								<p className={entryDate}>
									{entry.data.highlight?.logoUrl
										? `${entry.data.title} • `
										: ''}
									{getHumanReadableDate(entry.data.date)}
								</p>
								<p>{entry.data.description}</p>
							</div>
							{entry.data.highlight?.logoUrl && (
								<Image
									width={40}
									height={40}
									style={{ borderRadius: 10 }}
									src={entry.data.highlight.logoUrl}
									alt=""
								/>
							)}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
