import Script from 'next/script'
import type { ReactNode } from 'react'

import { entryContainer } from './styles.css'

type Props = { children: ReactNode }

export default function PostTemplate({ children }: Props) {
	return (
		<>
			<div className={entryContainer}>{children}</div>
			<Script
				src="https://giscus.app/client.js"
				data-repo="cesargdm/cesargdm.com"
				data-repo-id="MDEwOlJlcG9zaXRvcnkyMDM4MjI1MjY="
				data-category="Announcements"
				data-category-id="DIC_kwDODCYVvs4CZztS"
				data-mapping="pathname"
				data-strict="0"
				data-reactions-enabled="1"
				data-emit-metadata="0"
				data-input-position="top"
				data-theme="preferred_color_scheme"
				data-lang="en"
				data-loading="lazy"
				crossOrigin="anonymous"
				async
			/>
		</>
	)
}
