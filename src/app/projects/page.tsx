import Link from 'next/link'

import { getProjects } from '@/lib/projects'

export const metadata = {
	title: 'Projects',
}

export default function Blog() {
	const entries = getProjects('es')

	return (
		<div>
			<h1>Projects</h1>
			<ul>
				{entries.map((entry) => (
					<li key={entry.slug}>
						<Link href={`/projects/${entry.slug}`}>
							<p>{entry.data.title}</p>
							<p>{entry.data.description}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
