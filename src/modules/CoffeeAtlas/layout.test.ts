import { expect, test } from 'bun:test'

import { VARIETIES } from '@/lib/coffee/data'

import { coffeeLayout } from './layout'

test('every filtered record remains reachable and fits the initial canvas on phone and desktop', () => {
	for (const narrow of [true, false]) {
		for (const records of [
			VARIETIES,
			VARIETIES.filter((v) => v.species.value === 'arabica'),
			VARIETIES.filter((v) => v.group.value === 'bourbon'),
			VARIETIES.filter((v) => v.id === 'caturra'),
			[],
		]) {
			const layout = coffeeLayout(records, narrow)
			expect(new Set(layout.nodes.map((node) => node.id))).toEqual(
				new Set(records.map((v) => v.id)),
			)
			for (const node of layout.nodes) {
				expect(node.x - node.r).toBeGreaterThanOrEqual(0)
				expect(node.y - node.r).toBeGreaterThanOrEqual(0)
				expect(node.x + node.r).toBeLessThanOrEqual(layout.width)
				expect(node.y + node.r).toBeLessThanOrEqual(layout.height)
				// Species labels must not cover a variety's target after filtering.
				const hub = layout.hubs.find((item) => item.id === node.hub)!
				expect(Math.hypot(node.x - hub.x, node.y - hub.y)).toBeGreaterThan(
					node.r + 35 + Math.sqrt(hub.count) * 3,
				)
			}
		}
	}
})

test('documented breeding parents have stronger visual prominence than terminal selections', () => {
	const { nodes } = coffeeLayout(VARIETIES, false)
	expect(nodes.find((n) => n.id === 'caturra')!.r).toBeGreaterThan(
		nodes.find((n) => n.id === 'oro-azteca')!.r,
	)
	expect(nodes.find((n) => n.id === 't5296')!.r).toBeGreaterThan(
		nodes.find((n) => n.id === 'parainema')!.r,
	)
})
