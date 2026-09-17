import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import {
	COUNTRIES,
	GROUPS,
	RELATIONSHIPS,
	REVISION,
	SOURCES,
	SPECIES,
	VARIETIES,
} from '@/lib/coffee/data'
import type { Claim } from '@/lib/coffee/data'
import {
	changeSpecies,
	EVIDENCE,
	filterVarieties,
	INITIAL,
	parseState,
	stateParams,
} from '@/lib/coffee/explore'
import type { ExploreState } from '@/lib/coffee/explore'
import type { Locale } from '@/lib/i18n'
import type { MessageId } from '@/lib/message-ids'
import { getTranslate } from '@/lib/translate'

import Graph from './Graph'
import * as s from './styles.css'

export default function CoffeeAtlas({ locale }: { locale: Locale }) {
	const t = getTranslate(locale)
	const [state, setState] = useState<ExploreState>(INITIAL)
	const [expanded, setExpanded] = useState(false)
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [shareMessage, setShareMessage] = useState('')
	const [draft, setDraft] = useState('')
	const root = useRef<HTMLElement>(null)
	const profile = useRef<HTMLElement>(null)
	const filters = useRef<HTMLDivElement>(null)
	const opener = useRef<HTMLElement | SVGElement | null>(null)
	useEffect(() => {
		function restore() {
			const next = parseState(new URLSearchParams(location.search))
			setState(next)
			setDraft(next.q)
		}
		restore()
		window.addEventListener('popstate', restore)
		return () => window.removeEventListener('popstate', restore)
	}, [])
	function update(next: ExploreState) {
		const canonical = parseState(stateParams(next))
		setState(canonical)
		setDraft(canonical.q)
		setShareMessage('')
		const query = stateParams(canonical).toString()
		history.pushState(
			null,
			'',
			`${location.pathname}${query ? `?${query}` : ''}`,
		)
	}
	function choose(id: string) {
		opener.current =
			document.activeElement instanceof HTMLElement ||
			document.activeElement instanceof SVGElement
				? document.activeElement
				: null
		update({ ...state, selected: id })
	}
	function closeProfile() {
		update({ ...state, selected: '' })
		requestAnimationFrame(() => {
			if (opener.current?.isConnected) opener.current.focus()
			else root.current?.querySelector<HTMLButtonElement>('button')?.focus()
		})
	}
	useEffect(() => {
		if (state.selected) profile.current?.focus()
	}, [state.selected])
	useEffect(() => {
		if (filtersOpen)
			filters.current?.querySelector<HTMLButtonElement>('button')?.focus()
	}, [filtersOpen])
	useEffect(() => {
		if (!expanded && !filtersOpen) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	}, [expanded, filtersOpen])
	const filterKey = stateParams({
		...state,
		selected: '',
		view: 'graph',
	}).toString()
	const records = useMemo(
		() => filterVarieties(parseState(new URLSearchParams(filterKey))),
		[filterKey],
	)
	useEffect(() => {
		const link = document.querySelector<HTMLAnchorElement>('footer a[hreflang]')
		if (!link) return
		const original = link.getAttribute('href')!
		const url = new URL(original, location.href)
		url.search = stateParams(state).toString()
		link.href = url.toString()
		return () => {
			link.setAttribute('href', original)
		}
	}, [state])

	const selected = VARIETIES.find((v) => v.id === state.selected)
	const speciesRecords = VARIETIES.filter(
		(v) => !state.species || v.species.value === state.species,
	)
	const groupIds = [
		...new Set(speciesRecords.map((v) => v.group.value ?? 'unknown')),
	]
	const originIds = [...Object.keys(COUNTRIES), 'unknown']
	const related = selected
		? RELATIONSHIPS.filter(
				(e) => e.from === selected.id || e.to === selected.id,
			)
		: []
	function label(id: string) {
		return (
			GROUPS[id]?.[locale] ??
			COUNTRIES[id]?.[locale] ??
			SPECIES.find((sp) => sp.id === id)?.name ??
			VARIETIES.find((v) => v.id === id)?.name ??
			(EVIDENCE.includes(id as never) ? t(`coffee.${id}` as MessageId) : id)
		)
	}
	function toggle(key: 'groups' | 'origins' | 'evidence', value: string) {
		const values = state[key] as string[]
		update({
			...state,
			[key]: values.includes(value)
				? values.filter((v) => v !== value)
				: [...values, value],
		})
	}
	function facet(
		key: 'groups' | 'origins' | 'evidence',
		title: string,
		values: string[],
	) {
		return (
			<fieldset className={s.filterGroup}>
				<legend>{title}</legend>
				{values.map((value) => (
					<label className={s.check} key={value}>
						<input
							type="checkbox"
							checked={(state[key] as string[]).includes(value)}
							onChange={() => toggle(key, value)}
						/>
						{label(value)}
					</label>
				))}
			</fieldset>
		)
	}
	function citation(claim: Claim<unknown>) {
		const source = SOURCES.find((item) => item.id === claim.source)
		return (
			<small className={s.muted}>
				{t(`coffee.${claim.status}`)}
				{source && (
					<>
						{' '}
						·{' '}
						<a href={source.url} target="_blank" rel="noreferrer">
							{source.title}
						</a>{' '}
						· {t('coffee.reviewed')} {source.reviewed}
					</>
				)}
			</small>
		)
	}
	function fact(title: string, claim: Claim<unknown>, value: ReactNode) {
		return (
			<div>
				<strong>{title}</strong>
				<p>{value}</p>
				{citation(claim)}
			</div>
		)
	}
	async function share() {
		try {
			await navigator.clipboard.writeText(location.href)
			setShareMessage(t('coffee.copied'))
		} catch {
			setShareMessage(`${t('coffee.copyFailed')}: ${location.href}`)
		}
	}
	const chips = [
		...(state.species
			? [
					{
						text: label(state.species),
						clear: () => update(changeSpecies(state, '')),
					},
				]
			: []),
		...(state.q
			? [{ text: state.q, clear: () => update({ ...state, q: '' }) }]
			: []),
		...(state.lineage
			? [
					{
						text: `${t('coffee.lineageLabel')}: ${label(state.lineage)}`,
						clear: () => update({ ...state, lineage: '' }),
					},
				]
			: []),
		...(['groups', 'origins', 'evidence'] as const).flatMap((key) =>
			state[key].map((value) => ({
				text: label(value),
				clear: () => toggle(key, value),
			})),
		),
	]
	useEffect(() => {
		const element = root.current
		if (!element) return
		function handleKey(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				if (filtersOpen) {
					setFiltersOpen(false)
					root.current
						?.querySelector<HTMLButtonElement>('[data-filter-toggle]')
						?.focus()
				} else if (selected) closeProfile()
				else setExpanded(false)
			}
			// Keep keyboard focus inside the modal filter drawer.
			if (event.key === 'Tab' && filtersOpen && filters.current) {
				const items = filters.current.querySelectorAll<HTMLElement>(
					'button, input, select',
				)
				const first = items[0]
				const last = items[items.length - 1]
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault()
					last?.focus()
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault()
					first?.focus()
				}
			}
		}
		element.addEventListener('keydown', handleKey)
		return () => element.removeEventListener('keydown', handleKey)
	})

	return (
		<section
			className={s.atlas}
			aria-label={t('coffee.title')}
			ref={root}
			data-expanded={expanded}
		>
			<header className={s.hero}>
				<span className={s.eyebrow}>
					{t('coffee.title')} / {t('coffee.eyebrow')}
				</span>
				<h1 className={s.title}>{t('coffee.intro')}</h1>
				<p className={s.subtitle}>{t('coffee.subtitle')}</p>
			</header>
			<div className={s.toolbar}>
				<form
					style={{ display: 'flex', flex: '1 1 240px', gap: 8 }}
					onSubmit={(e) => {
						e.preventDefault()
						update({ ...state, q: draft })
					}}
				>
					<input
						className={s.search}
						type="search"
						aria-label={t('coffee.search')}
						placeholder={t('coffee.search')}
						value={draft}
						onChange={(e) => {
							setDraft(e.target.value)
							if (!e.target.value) update({ ...state, q: '' })
						}}
					/>
					<button
						className={s.button}
						type="submit"
						aria-label={t('coffee.search')}
					>
						↗
					</button>
				</form>
				<button
					className={`${s.button} ${s.mobileToggle}`}
					data-filter-toggle
					type="button"
					aria-expanded={filtersOpen}
					onClick={() => setFiltersOpen(!filtersOpen)}
				>
					{t('coffee.filters')}
				</button>
				{(['graph', 'list'] as const).map((view) => (
					<button
						className={s.button}
						key={view}
						type="button"
						aria-pressed={state.view === view}
						onClick={() => update({ ...state, view })}
					>
						{t(`coffee.${view}`)}
					</button>
				))}
				<button
					className={s.button}
					type="button"
					aria-pressed={expanded}
					onClick={() => setExpanded(!expanded)}
				>
					{t(expanded ? 'coffee.collapse' : 'coffee.expand')}
				</button>
			</div>
			<div className={s.row}>
				<nav className={s.toolbar} aria-label={t('coffee.filters')}>
					<button
						className={s.chip}
						type="button"
						onClick={() => update({ ...INITIAL })}
					>
						{t('coffee.overview')}
					</button>
					{chips.map((chip, index) => (
						<button
							className={s.chip}
							key={`${chip.text}-${index}`}
							type="button"
							onClick={() => chip.clear()}
							aria-label={`${t('coffee.remove')}: ${chip.text}`}
						>
							{chip.text} ×
						</button>
					))}
				</nav>
				<output className={s.muted}>
					{t('coffee.results', { count: records.length })}
				</output>
			</div>
			<div className={s.workspace} data-profile={Boolean(selected)}>
				<div
					className={s.filters}
					ref={filters}
					data-open={filtersOpen}
					role={filtersOpen ? 'dialog' : undefined}
					aria-modal={filtersOpen || undefined}
					aria-label={t('coffee.filters')}
				>
					<div className={s.row}>
						<strong>{t('coffee.filters')}</strong>
						<button
							type="button"
							className={`${s.button} ${s.mobileToggle}`}
							onClick={() => {
								setFiltersOpen(false)
								root.current
									?.querySelector<HTMLButtonElement>('[data-filter-toggle]')
									?.focus()
							}}
						>
							{t('coffee.close')}
						</button>
					</div>
					<label className={s.filterGroup}>
						{t('coffee.species')}
						<select
							value={state.species}
							onChange={(e) => update(changeSpecies(state, e.target.value))}
						>
							<option value="">{t('coffee.overview')}</option>
							{SPECIES.map((sp) => (
								<option key={sp.id} value={sp.id}>
									{sp.name}
								</option>
							))}
						</select>
					</label>
					{state.species && facet('groups', t('coffee.group'), groupIds)}
					{facet('origins', t('coffee.origin'), originIds)}
					{facet('evidence', t('coffee.evidence'), EVIDENCE)}
					<button
						className={s.button}
						type="button"
						onClick={() => update({ ...INITIAL })}
					>
						{t('coffee.reset')}
					</button>
				</div>
				<section aria-label={t('coffee.graph')}>
					<div className={s.stage}>
						{!records.length ? (
							<div className={s.panel}>
								<p>{t('coffee.empty')}</p>
								<button
									className={s.button}
									type="button"
									onClick={() => update({ ...INITIAL })}
								>
									{t('coffee.reset')}
								</button>
							</div>
						) : state.view === 'list' ? (
							<div className={s.list}>
								{records.map((v) => (
									<button
										key={v.id}
										type="button"
										className={s.listItem}
										aria-pressed={state.selected === v.id}
										onClick={() => choose(v.id)}
									>
										<span>
											{v.name}
											<small style={{ display: 'block' }} className={s.muted}>
												{label(v.species.value)} ·{' '}
												{label(v.origin.value ?? 'unknown')}
											</small>
										</span>
										<span aria-hidden="true">↗</span>
									</button>
								))}
							</div>
						) : (
							<Graph
								records={records}
								species={state.species}
								selected={state.selected}
								locale={locale}
								expanded={expanded}
								onSpecies={(id) => update(changeSpecies(state, id))}
								onSelect={choose}
							/>
						)}
					</div>
					<p className={s.graphHint}>
						{t('coffee.hint')} · {t('coffee.touchHint')} · {t('coffee.sizes')}
					</p>
					<div className={s.legend}>
						{state.species ? (
							<>
								<span>―→ {t('coffee.parent')}</span>
								<span>┄→ {t('coffee.mutation')}</span>
								<span>···→ {t('coffee.selection')}</span>
								<span>{t('coffee.membership')}</span>
								{selected && (
									<>
										<span style={{ color: '#679bb0' }}>
											→ {t('coffee.derivedFrom')}
										</span>
										<span style={{ color: '#c99047' }}>
											→ {t('coffee.gaveRiseTo')}
										</span>
									</>
								)}
							</>
						) : (
							<>
								<span>{t('coffee.featured')}</span>
								<span>{t('coffee.counts')}</span>
							</>
						)}
					</div>
				</section>
				{selected ? (
					<aside
						className={s.profile}
						ref={profile}
						tabIndex={-1}
						aria-label={selected.name}
					>
						<div className={s.row}>
							<span className={s.eyebrow}>{label(selected.species.value)}</span>
							<button
								type="button"
								className={s.button}
								onClick={closeProfile}
								aria-label={t('coffee.close')}
							>
								×
							</button>
						</div>
						<h2 className={s.profileTitle}>{selected.name}</h2>
						<div className={s.lineageSummary}>
							{(['incoming', 'outgoing'] as const).map((direction) => {
								const edges = related.filter((edge) =>
									direction === 'incoming'
										? edge.to === selected.id
										: edge.from === selected.id,
								)
								if (!edges.length && direction === 'outgoing') return null
								return (
									<div key={direction}>
										<h3 className={s.eyebrow}>
											{t(
												direction === 'incoming'
													? 'coffee.derivedFrom'
													: 'coffee.gaveRiseTo',
											)}
										</h3>
										{!edges.length && (
											<p className={s.muted}>{t('coffee.noParents')}</p>
										)}
										{edges.map((edge) => (
											<div key={`${edge.from}-${edge.to}`}>
												<button
													type="button"
													className={s.relativeButton}
													onClick={() =>
														choose(
															direction === 'incoming' ? edge.from : edge.to,
														)
													}
												>
													<span>
														{direction === 'incoming' ? '↳' : '↗'}{' '}
														{
															VARIETIES.find(
																(v) =>
																	v.id ===
																	(direction === 'incoming'
																		? edge.from
																		: edge.to),
															)?.name
														}
													</span>
													<small>
														{t(
															edge.type === 'selection'
																? 'coffee.selection'
																: edge.type === 'mutation'
																	? 'coffee.mutationKind'
																	: direction === 'incoming'
																		? 'coffee.crossParent'
																		: 'coffee.crossOffspring',
														)}
													</small>
												</button>
												{citation({
													value: '',
													source: edge.source,
													status: edge.status,
												})}
											</div>
										))}
									</div>
								)
							})}
						</div>
						<p>{selected.summary.value[locale]}</p>
						{citation(selected.summary)}
						<button
							type="button"
							className={s.button}
							onClick={() =>
								update({
									...state,
									species: selected.species.value,
									groups: [],
									origins: [],
									evidence: [],
									q: '',
									lineage: selected.id,
								})
							}
						>
							{t('coffee.lineage')} ↗
						</button>
						{fact(
							t('coffee.kind'),
							selected.kind,
							t(`coffee.${selected.kind.value}`),
						)}
						{fact(
							t('coffee.species'),
							selected.species,
							label(selected.species.value),
						)}
						{fact(
							t('coffee.origin'),
							selected.origin,
							label(selected.origin.value ?? 'unknown'),
						)}
						{fact(
							t('coffee.group'),
							selected.group,
							label(selected.group.value ?? 'unknown'),
						)}
						{Boolean(selected.aliases.length) && (
							<div>
								<strong>{t('coffee.aliases')}</strong>
								<p>{selected.aliases.join(', ')}</p>
								{citation(selected.summary)}
							</div>
						)}
					</aside>
				) : null}
			</div>
			<div className={s.row}>
				<span className={s.muted}>
					{t('coffee.revision')} · {REVISION}
				</span>
				<button type="button" className={s.button} onClick={share}>
					{t('coffee.share')}
				</button>
			</div>
			<output className={s.muted} style={{ overflowWrap: 'anywhere' }}>
				{shareMessage}
			</output>
			<details className={s.panel}>
				<summary>{t('coffee.coverage')}</summary>
				<p>{t('coffee.coverageBody')}</p>
				<p>{t('coffee.method')}</p>
				<p>{t('coffee.updates')}</p>
				<a
					href="https://github.com/cesargdm/cesargdm.com/issues/new?title=Coffee%20Atlas%3A%20data%20suggestion"
					target="_blank"
					rel="noreferrer"
				>
					{t('coffee.suggest')} ↗
				</a>
				<details>
					<summary>{t('coffee.sources')}</summary>
					{SOURCES.map((source) => (
						<p key={source.id} className={s.muted}>
							<a href={source.url} target="_blank" rel="noreferrer">
								{source.title}
							</a>{' '}
							· {t('coffee.reviewed')} {source.reviewed} ·{' '}
							{source.published ?? t('coffee.undated')}
						</p>
					))}
				</details>
			</details>
		</section>
	)
}
