'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconBrandLinkedin, IconBrandX } from '@tabler/icons-react'

import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

import {
	sitename,
	smallDescription,
	socialLink,
	socialLinksList,
} from './styles.css'

export default function SideAboutMe({ locale }: { locale: Locale }) {
	const t = useMemo(() => getTranslate(locale), [locale])

	const [url, setUrl] = useState('')

	useEffect(() => {
		setUrl(window.location.href)
	}, [])

	const handleShare = useCallback(() => {
		navigator.share({ title: 'César Guadarrama Cantú', url }).catch(() => null)
	}, [])

	return (
		<aside>
			<img
				style={{ borderRadius: 9999 }}
				src="/apple-touch-icon.png"
				width={40}
				height={40}
				alt={t('aside.avatarAlt')}
			/>
			<p className={sitename}>cesargdm</p>
			<p className={smallDescription}>{t('aside.description')}</p>
			<ul className={socialLinksList}>
				{Boolean(url) && (
					<li>
						<a
							className={socialLink}
							aria-label={t('share.x')}
							href={`https://x.com/intent/tweet?text=Check out this awesome post by @cesargdm ${url}`}
						>
							<IconBrandX aria-hidden />
						</a>
					</li>
				)}
				{Boolean(url) && (
					<li>
						<a
							className={socialLink}
							aria-label={t('share.linkedin')}
							href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
						>
							<IconBrandLinkedin aria-hidden />
						</a>
					</li>
				)}
			</ul>
			{Boolean(
				typeof navigator === 'object' &&
				url &&
				typeof navigator.share === 'function',
			) && <button onClick={handleShare}>{t('aside.share')}</button>}
		</aside>
	)
}
