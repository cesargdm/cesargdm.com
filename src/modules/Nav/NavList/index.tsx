import { useCallback, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import type { ChangeEvent } from 'react'

import TextInput from '@/components/TextInput'

import type { Locale } from '@/lib/i18n'
import { useSiteSearch } from '@/lib/use-site-search'

import Search from '../Search'

import StaticNavList from './StaticNavList'

import { centerNavList, navItem, searchList } from '../styles.css'

function getInitialQuery() {
	if (typeof window === 'undefined') return null
	return new URLSearchParams(window.location.search).get('query')
}

function updateQueryParam(value: string | null) {
	if (typeof window === 'undefined') return

	const url = new URL(window.location.href)

	if (value === null) {
		url.searchParams.delete('query')
	} else {
		url.searchParams.set('query', value)
	}

	window.history.replaceState(window.history.state, '', url.toString())
}

export default function NavList({
	locale,
	pathname,
}: {
	locale: Locale
	pathname: string
}) {
	const navList = useRef<HTMLOListElement>(null)

	const [query, setQuery] = useState<string | null>(getInitialQuery)
	const [isOpen, setIsOpen] = useState(() => getInitialQuery() !== null)

	const { results } = useSiteSearch(locale, query)

	const handleOnSearch = useCallback(() => {
		if (isOpen) {
			setIsOpen(false)
			setQuery(null)
			updateQueryParam(null)
		} else {
			setIsOpen(true)
			setQuery((current) => current ?? '')
			updateQueryParam(query ?? '')
		}
	}, [isOpen, query])

	const handleOnSearchChange = useCallback(
		({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
			setQuery(value)
			updateQueryParam(value)
		},
		[],
	)

	const handleOnInteractOutside = useCallback(
		(event: { target: EventTarget | null }) => {
			// Ignore clicks in the nav list
			if (navList.current?.contains(event.target as Node)) return

			setIsOpen(false)
			setQuery(null)
			updateQueryParam(null)
		},
		[navList],
	)

	return (
		<Popover.Root open={isOpen}>
			<Popover.Anchor asChild>
				<ol ref={navList} className={centerNavList}>
					{isOpen ? (
						<TextInput
							type="search"
							style={{ width: '100%', flexGrow: 1 }}
							placeholder="Start typing to search..."
							onChange={handleOnSearchChange}
							value={query as string}
						/>
					) : (
						<StaticNavList locale={locale} pathname={pathname} />
					)}

					<li className={navItem}>
						<Search isOpen={isOpen} onClick={handleOnSearch} />
					</li>
				</ol>
			</Popover.Anchor>

			<Popover.Portal>
				<Popover.Content
					hideWhenDetached
					onInteractOutside={handleOnInteractOutside}
					sideOffset={16}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={false}
					asChild
				>
					{results.length ? (
						<ol className={searchList} aria-live="polite">
							{results.map((result) => (
								<li style={{ padding: 16 }} key={result.id}>
									<a
										style={{
											display: 'inline-flex',
											height: '100%',
											width: '100%',
											flexDirection: 'column',
											textDecoration: 'none',
											gap: 4,
											minWidth: 200,
										}}
										href={result.url}
									>
										<p
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												gap: 16,
											}}
										>
											<b>{result.title}</b>
											<span
												style={{
													display: 'inline-flex',
													padding: '2px 8px',
													borderRadius: 999,
													backgroundColor: '#ddd',
													fontSize: '0.6rem',
													fontWeight: 'bold',
													textTransform: 'uppercase',
													alignItems: 'center',
												}}
											>
												{result.type}
											</span>
										</p>
										{result.description ? <p>{result.description}</p> : null}
									</a>
								</li>
							))}
						</ol>
					) : (
						<div>
							<p>{query ? 'No results' : 'Start typing to see suggestions'}</p>
						</div>
					)}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
