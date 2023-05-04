import Link from 'next/link'
import { getPosts } from '@/lib/blog'

export const metadata = {
	title: 'Blog',
}

export default function Blog() {
	const entries = getPosts('es')

	return (
		<div>
			<h1>Blog</h1>
			<ul>
				{entries.map((entry) => (
					<li key={entry.slug}>
						<Link href={`/blog/${entry.slug}`}>
							<p>{entry.data.title}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
