'use client'

export default function SideAboutMe() {
	const url = window.location.href

	return (
		<aside>
			<p>César Guadarrama Cantú</p>
			<p style={{ fontSize: '0.85rem' }}>
				Experienced Product Engineer crafting interfaces with latest
				technologies. Contributed to success of multiple top companies.
			</p>
			<ul>
				<li>
					<a
						href={`https://twitter.com/intent/tweet?text=Check out this awesome post by @cesargdm ${url}`}
					>
						Twitter
					</a>
				</li>
				<li>
					<a
						href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
					>
						LinkedIn
					</a>
				</li>
			</ul>
			{typeof navigator.share === 'function' && (
				<button
					onClick={() =>
						navigator
							.share({
								title: 'César Guadarrama Cantú',
								url,
							})
							.catch(() => undefined)
					}
				>
					Share
				</button>
			)}
		</aside>
	)
}
