import { algoliasearch } from 'algoliasearch'
import aa from 'search-insights'

import type { Locale } from '@/lib/i18n'

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string

export const algoliaSearchClient = algoliasearch(APP_ID, SEARCH_API_KEY)

export function getAlgoliaIndexName(locale: Locale = 'en') {
	return `dev_cesargdm_${locale}` as const
}

aa('init', {
	appId: APP_ID,
	apiKey: SEARCH_API_KEY,
	useCookie: true,
	userHasOptedOut: false,
})
