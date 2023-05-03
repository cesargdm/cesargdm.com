import Link from 'next/link'

export const metadata = {
	title: 'Blog',
}

export default function Blog() {
	return (
		<div>
			<h1>Blog</h1>
			<ul>
				<li>
					<Link href="/blog/cogito-ergo-machina">
						<p>Cogito ergo machina</p>
					</Link>
				</li>
				<li>
					<Link href="/blog/moderacion-moderna">
						<p>Moderación moderna</p>
					</Link>
				</li>
				<li>
					<Link href="/blog/tecno-neuroetica">
						<p>Tecno-neuroética</p>
					</Link>
				</li>
			</ul>
		</div>
	)
}
