import { COUNTRIES, GROUPS, RELATIONSHIPS, SPECIES, VARIETIES } from './data'
import type { Evidence, Relationship, Variety } from './data'

export type ExploreState = {
	species: string
	q: string
	groups: string[]
	origins: string[]
	evidence: Evidence[]
	lineage: string
	selected: string
	view: 'graph' | 'list'
}
export const INITIAL: ExploreState = {
	species: '',
	q: '',
	groups: [],
	origins: [],
	evidence: [],
	lineage: '',
	selected: '',
	view: 'graph',
}
export const EVIDENCE: Evidence[] = [
	'documented',
	'reported',
	'disputed',
	'unknown',
]
export function normalize(text: string) {
	return text
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim()
}
export function lineageIds(
	id: string,
	edges: Relationship[] = RELATIONSHIPS,
): Set<string> {
	const result = new Set([id])
	// Traverse each direction independently: ancestors' other descendants are not this lineage.
	for (const direction of ['up', 'down']) {
		const visited = new Set([id])
		const queue = [id]
		while (queue.length) {
			const current = queue.shift()
			for (const edge of edges) {
				const match =
					direction === 'up' ? edge.to === current : edge.from === current
				const next = direction === 'up' ? edge.from : edge.to
				if (match && !visited.has(next)) {
					visited.add(next)
					result.add(next)
					queue.push(next)
				}
			}
		}
	}
	return result
}
export function filterVarieties(
	state: ExploreState,
	records: Variety[] = VARIETIES,
) {
	const lineage = state.lineage ? lineageIds(state.lineage) : null
	const terms = normalize(state.q).split(/\s+/).filter(Boolean)
	return records.filter(
		(v) =>
			(!state.species || v.species.value === state.species) &&
			(!state.groups.length ||
				state.groups.includes(v.group.value ?? 'unknown')) &&
			(!state.origins.length ||
				state.origins.includes(v.origin.value ?? 'unknown')) &&
			(!state.evidence.length ||
				[v.species, v.kind, v.origin, v.group, v.summary].some((c) =>
					state.evidence.includes(c.status),
				)) &&
			(!lineage || lineage.has(v.id)) &&
			terms.every((term) =>
				normalize([v.name, ...v.aliases].join(' ')).includes(term),
			),
	)
}
export function changeSpecies(
	state: ExploreState,
	species: string,
): ExploreState {
	return { ...state, species, groups: [], lineage: '', selected: '' }
}
export function parseState(params: URLSearchParams): ExploreState {
	const species = SPECIES.some((s) => s.id === params.get('species'))
		? params.get('species')!
		: ''
	const ids = VARIETIES.filter(
		(v) => !species || v.species.value === species,
	).map((v) => v.id)
	const allowedGroups = new Set(
		VARIETIES.filter((v) => !species || v.species.value === species).map(
			(v) => v.group.value ?? 'unknown',
		),
	)
	return {
		species,
		q: (params.get('q') ?? '').slice(0, 200),
		groups: [...new Set(params.getAll('group'))].filter(
			(g) => (g in GROUPS || g === 'unknown') && allowedGroups.has(g),
		),
		origins: [...new Set(params.getAll('origin'))].filter(
			(g) => g in COUNTRIES || g === 'unknown',
		),
		evidence: EVIDENCE.filter((e) => params.getAll('evidence').includes(e)),
		lineage: ids.includes(params.get('lineage') ?? '')
			? params.get('lineage')!
			: '',
		selected: ids.includes(params.get('variety') ?? '')
			? params.get('variety')!
			: '',
		view: params.get('view') === 'list' ? 'list' : 'graph',
	}
}
export function stateParams(state: ExploreState) {
	const params = new URLSearchParams()
	for (const [key, value] of [
		['species', state.species],
		['q', state.q],
		['lineage', state.lineage],
		['variety', state.selected],
	])
		if (value) params.set(key, value)
	for (const [key, values] of [
		['group', state.groups],
		['origin', state.origins],
		['evidence', state.evidence],
	] as const)
		for (const value of values) params.append(key, value)
	if (state.view === 'list') params.set('view', 'list')
	return params
}
