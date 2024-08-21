'use client'

import { useEffect } from 'react'
import aa from 'search-insights'

import { getAlgoliaIndexName } from '@/lib/algolia/utils'
import type { Locale } from '@/lib/i18n'

export default function PageAnalytics({
	locale,
	objectId,
}: {
	locale: Locale
	objectId: string
}) {
	useEffect(() => {
		if (!objectId) return
		if (typeof window === 'undefined') return

		try {
			aa('viewedObjectIDs', {
				index: getAlgoliaIndexName(locale),
				objectIDs: [objectId],
				eventName: `Viewed ${objectId.split('-')[0]}`,
			})
		} catch {
			//
		}
	}, [])

	return null
}
