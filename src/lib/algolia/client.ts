import { algoliasearch } from 'algoliasearch'
import aa from 'search-insights'

const APP_ID = import.meta.env.PUBLIC_ALGOLIA_APP_ID as string
const SEARCH_API_KEY = import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY as string

export const algoliaSearchClient =
	APP_ID && SEARCH_API_KEY ? algoliasearch(APP_ID, SEARCH_API_KEY) : null

if (APP_ID && SEARCH_API_KEY) {
	aa('init', {
		appId: APP_ID,
		apiKey: SEARCH_API_KEY,
		useCookie: true,
		userHasOptedOut: false,
	})
}
