import { describe, expect, test } from 'bun:test'

import { RELATIONSHIPS, SOURCES, SPECIES, VARIETIES } from './data'
import {
	changeSpecies,
	filterVarieties,
	INITIAL,
	lineageIds,
	parseState,
	stateParams,
} from './explore'

describe('coffee exploration', () => {
	test('searches aliases and ignores accents', () => {
		expect(
			filterVarieties({ ...INITIAL, q: 'gesha' }).map((v) => v.id),
		).toEqual(['geisha-panama'])
		expect(
			filterVarieties({ ...INITIAL, q: 'catuai' }).map((v) => v.id),
		).toEqual(['catuai'])
	})
	test('combines facets with AND, values with OR and preserves unknowns', () => {
		const records = filterVarieties({
			...INITIAL,
			species: 'arabica',
			origins: ['BR', 'SV'],
			groups: ['bourbon'],
		})
		expect(new Set(records.map((v) => v.id))).toEqual(
			new Set(['caturra', 'pacas', 'tekisic']),
		)
		expect(
			filterVarieties({ ...INITIAL, origins: ['unknown'] }).map((v) => v.id),
		).toContain('typica')
		expect(
			filterVarieties({ ...INITIAL, species: 'canephora', origins: ['KE'] }),
		).toEqual([])
	})
	test('lineage includes both parents, never invents siblings through a shared ancestor', () => {
		const lineage = lineageIds('pacamara')
		expect(lineage.has('pacas')).toBe(true)
		expect(lineage.has('maragogipe')).toBe(true)
		expect(lineage.has('bourbon')).toBe(true)
		expect(lineage.has('typica')).toBe(true)
		expect(lineage.has('caturra')).toBe(false)
		expect(lineageIds('sl28')).toEqual(new Set(['sl28']))
	})
	test('cycles terminate safely', () => {
		expect(
			lineageIds('a', [
				{
					from: 'a',
					to: 'b',
					type: 'parent',
					source: 'test',
					status: 'reported',
				},
				{
					from: 'b',
					to: 'a',
					type: 'parent',
					source: 'test',
					status: 'reported',
				},
			]),
		).toEqual(new Set(['a', 'b']))
	})
	test('species changes clear dependent facets but retain search and origins', () => {
		expect(
			changeSpecies(
				{
					...INITIAL,
					q: 'SL',
					groups: ['bourbon'],
					origins: ['KE'],
					lineage: 'bourbon',
					selected: 'sl28',
				},
				'canephora',
			),
		).toEqual({ ...INITIAL, species: 'canephora', q: 'SL', origins: ['KE'] })
	})
	test('shared state roundtrips and untrusted URL values normalize', () => {
		const state = {
			...INITIAL,
			species: 'arabica',
			q: 'café',
			groups: ['bourbon'],
			origins: ['BR'],
			lineage: 'bourbon',
			selected: 'caturra',
			view: 'list' as const,
		}
		expect(parseState(stateParams(state))).toEqual(state)
		expect(
			parseState(
				new URLSearchParams(
					'species=canephora&variety=caturra&group=bourbon&origin=bad&view=bad&lineage=bad',
				),
			),
		).toEqual({ ...INITIAL, species: 'canephora' })
	})
})

describe('coffee dataset integrity', () => {
	test('records and claims have valid identities, sources and translations', () => {
		const ids = VARIETIES.map((v) => v.id)
		expect(new Set(ids).size).toBe(ids.length)
		for (const v of VARIETIES) {
			expect(SPECIES.some((sp) => sp.id === v.species.value)).toBe(true)
			for (const claim of [v.species, v.kind, v.origin, v.group, v.summary]) {
				if (claim.status === 'unknown') expect(claim.source).toBeNull()
				else
					expect(SOURCES.some((source) => source.id === claim.source)).toBe(
						true,
					)
			}
			expect(v.summary.value.en.length).toBeGreaterThan(0)
			expect(v.summary.value.es.length).toBeGreaterThan(0)
		}
		for (const source of SOURCES) {
			expect(new URL(source.url).protocol).toBe('https:')
			expect(Number.isNaN(Date.parse(source.reviewed))).toBe(false)
		}
	})
	test('ancestry endpoints are valid, noncontradictory and acyclic', () => {
		const pairs = new Set<string>()
		for (const edge of RELATIONSHIPS) {
			expect(VARIETIES.some((v) => v.id === edge.from)).toBe(true)
			expect(VARIETIES.some((v) => v.id === edge.to)).toBe(true)
			expect(SOURCES.some((source) => source.id === edge.source)).toBe(true)
			const pair = `${edge.from}/${edge.to}`
			expect(pairs.has(pair)).toBe(false)
			pairs.add(pair)
		}
		function visit(id: string, path = new Set<string>()) {
			expect(path.has(id)).toBe(false)
			for (const edge of RELATIONSHIPS.filter((e) => e.from === id))
				visit(edge.to, new Set([...path, id]))
		}
		for (const variety of VARIETIES) visit(variety.id)
	})
})
