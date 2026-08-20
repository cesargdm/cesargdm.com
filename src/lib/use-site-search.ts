import { useEffect, useState } from 'react'

import type { Locale } from '@/lib/i18n'
import { readJson } from '@/lib/json'
import type { SearchDocument } from '@/lib/search-index'
import { searchDocuments } from '@/lib/search-index'

const SEARCH_DEBOUNCE_MS = 150

/**
 * Loads the prebuilt index once, then filters it in memory. There is no request
 * per keystroke — the whole corpus is a few dozen documents.
 */
export function useSiteSearch(locale: Locale, query: string | null) {
	const [documents, setDocuments] = useState<SearchDocument[] | null>(null)
	const [results, setResults] = useState<SearchDocument[]>([])

	useEffect(() => {
		if (query === null || documents) return

		let cancelled = false

		fetch(`/${locale}/search-index.json`)
			.then((response) => readJson<SearchDocument[]>(response))
			.then((data) => {
				if (!cancelled) setDocuments(data)
			})
			.catch(() => {
				if (!cancelled) setDocuments([])
			})

		return () => {
			cancelled = true
		}
	}, [locale, query, documents])

	useEffect(() => {
		if (!documents || !query) {
			setResults([])
			return
		}

		const timer = setTimeout(
			() => setResults(searchDocuments(documents, query)),
			SEARCH_DEBOUNCE_MS,
		)

		return () => clearTimeout(timer)
	}, [documents, query])

	return { results, isReady: documents !== null }
}
