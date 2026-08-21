import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import TextInput from '@/components/TextInput'
import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'
import { useSiteSearch } from '@/lib/use-site-search'

import { resultItem, resultLink, resultList, typeBadge } from './styles.css'

function getInitialQuery() {
	if (typeof window === 'undefined') return ''
	return new URLSearchParams(window.location.search).get('query') ?? ''
}

export default function SiteSearch({ locale }: { locale: Locale }) {
	const t = useMemo(() => getTranslate(locale), [locale])

	const [query, setQuery] = useState(getInitialQuery)

	const { results } = useSiteSearch(locale, query)

	const handleChange = useCallback(
		({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
			setQuery(value)

			const url = new URL(window.location.href)

			if (value) url.searchParams.set('query', value)
			else url.searchParams.delete('query')

			window.history.replaceState(window.history.state, '', url.toString())
		},
		[],
	)

	return (
		<>
			<label htmlFor="site-search">
				<span className="visually-hidden">{t('search.label')}</span>
			</label>
			<TextInput
				id="site-search"
				type="search"
				value={query}
				onChange={handleChange}
				placeholder={t('search.placeholder')}
				style={{ width: '100%' }}
			/>

			<p aria-live="polite">
				{query
					? t('search.results', { count: results.length })
					: t('search.hint')}
			</p>

			<ol className={resultList}>
				{results.map((result) => (
					<li key={result.id} className={resultItem}>
						<a href={result.url} className={resultLink}>
							<b>{result.title}</b>
							<span className={typeBadge}>{result.type}</span>
						</a>
						{result.description ? <p>{result.description}</p> : null}
					</li>
				))}
			</ol>
		</>
	)
}
