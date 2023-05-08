import Link from 'next/link'

import { getProjects } from '@/lib/projects'

import {
	entryItem,
	entryLink,
	entryTitle,
	entriesList,
	entryDate,
} from '../blog/styles.css'

export const metadata = {
	title: 'Projects',
	openGraph: {
		title: 'Projects',
		description: 'César Guadarrama Cantú - Product engineer - Projects',
	},
}

export default function Blog() {
	const entries = getProjects('en')

	return (
		<div>
			<h1>Projects</h1>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li className={entryItem} key={entry.slug}>
						<Link className={entryLink} href={`/projects/${entry.slug}`}>
							<p className={entryTitle}>{entry.data.title}</p>
							<p className={entryDate}>{entry.data.date}</p>
							<p>{entry.data.description}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
