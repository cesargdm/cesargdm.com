import Link from 'next/link'

import { getProjects } from '@/lib/projects'
import { getMetadata } from '@/lib/metadata'

import {
	entryItem,
	entryDate,
	entryTitle,
	entriesList,
	highlightedEntry,
	projectEntryLink,
} from '../blog/styles.css'
import Image from 'next/image'

export const metadata = getMetadata({
	title: 'Projects',
	description: 'César Guadarrama Cantú - Product engineer - Projects',
})

export default function Blog() {
	const entries = getProjects('en')

	return (
		<div>
			<h1>Projects</h1>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li
						className={entry.data.highlight ? highlightedEntry : entryItem}
						key={entry.slug}
					>
						<Link
							style={{ backgroundColor: entry.data.highlight?.color }}
							className={projectEntryLink}
							href={`/projects/${entry.slug}`}
						>
							{entry.data.highlight?.logoUrl && (
								<Image
									width={40}
									height={40}
									style={{ borderRadius: 10 }}
									src={entry.data.highlight.logoUrl}
									alt=""
								/>
							)}
							<div>
								{!entry.data.highlight?.logoUrl && (
									<p className={entryTitle}>{entry.data.title}</p>
								)}
								<p className={entryDate}>
									{entry.data.highlight?.logoUrl
										? `${entry.data.title} • `
										: ''}
									{entry.data.date}
								</p>
								<p>{entry.data.description}</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
