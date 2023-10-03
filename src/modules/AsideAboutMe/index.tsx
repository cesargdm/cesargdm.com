'use client'

import { useEffect, useState } from 'react'
import { IconBrandLinkedin, IconBrandX } from '@tabler/icons-react'
import Image from 'next/image'

import {
	sitename,
	smallDescription,
	socialLink,
	socialLinksList,
} from './styles.css'

export default function SideAboutMe() {
	const [url, setUrl] = useState('')

	useEffect(() => {
		setUrl(window.location.href)
	}, [])

	return (
		<aside>
			<Image
				style={{ borderRadius: 9999 }}
				src="/apple-touch-icon.png"
				width={40}
				height={40}
				alt=""
			/>
			<p className={sitename}>cesargdm</p>
			<p className={smallDescription}>
				Product Engineer crafting interfaces with latest technologies.
				Contributed to the success of multiple top companies.
			</p>
			<ul className={socialLinksList}>
				{url && (
					<li>
						<a
							className={socialLink}
							aria-label="Share on X"
							href={`https://x.com/intent/tweet?text=Check out this awesome post by @cesargdm ${url}`}
						>
							<IconBrandX aria-hidden />
						</a>
					</li>
				)}
				{url && (
					<li>
						<a
							className={socialLink}
							aria-label="Share on LinkedIn"
							href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
						>
							<IconBrandLinkedin aria-hidden />
						</a>
					</li>
				)}
			</ul>
			{typeof navigator === 'object' && navigator.share && url && (
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
