'use client'

import Image from 'next/image'
import { IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react'

import {
	sitename,
	socialLink,
	socialLinksList,
	smallDescription,
} from './styles.css'

export default function SideAboutMe() {
	const url = typeof window !== 'undefined' && window.location.href

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
				Experienced Product Engineer crafting interfaces with latest
				technologies. Contributed to success of multiple top companies.
			</p>
			<ul className={socialLinksList}>
				<li>
					<a
						className={socialLink}
						href={`https://twitter.com/intent/tweet?text=Check out this awesome post by @cesargdm ${url}`}
					>
						<IconBrandTwitter aria-hidden />
						Twitter
					</a>
				</li>
				<li>
					{url && (
						<a
							className={socialLink}
							href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
						>
							<IconBrandLinkedin aria-hidden />
							LinkedIn
						</a>
					)}
				</li>
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
