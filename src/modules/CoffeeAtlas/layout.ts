import { RELATIONSHIPS, SPECIES } from '@/lib/coffee/data'
import type { Variety } from '@/lib/coffee/data'

export type Point = {
	id: string
	x: number
	y: number
	r: number
	group: string
	angle: number
	hub: string
	parent: boolean
}
export type Hub = { id: string; x: number; y: number; r: number; count: number }
export type Region = Hub & { group: string }
export const COLORS: Record<string, string> = {
	bourbon: '#d19a43',
	typica: '#ad805b',
	mixed: '#b59264',
	ethiopian: '#43a782',
	catimor: '#83ad50',
	sarchimor: '#5d82bf',
	f1: '#cf697f',
	introgressed: '#9480ab',
	congo: '#338eb0',
	guinea: '#d5a35d',
	'congo-guinea': '#38a995',
	uganda: '#b86c9b',
	congensis: '#9373ad',
	unknown: '#93938d',
}
export function polar(x: number, y: number, r: number, angle: number) {
	return { x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r }
}
// Positions express genetic groups; only independently cited relationships draw arrows.
export function coffeeLayout(records: Variety[], narrow: boolean) {
	const available = SPECIES.filter((sp) =>
		records.some((v) => v.species.value === sp.id),
	)
	const multiple = available.length > 1
	const width = narrow ? 760 : multiple ? 1440 : 1060
	const height = narrow && multiple ? 1420 : 920
	const nodes: Point[] = [],
		hubs: Hub[] = [],
		regions: Region[] = []
	available.forEach((sp, index) => {
		const members = records.filter((v) => v.species.value === sp.id)
		const r = multiple ? (sp.id === 'arabica' ? 295 : 240) : 335
		const hub: Hub = {
			id: sp.id,
			count: members.length,
			r,
			x: narrow || !multiple ? width / 2 : index ? 1090 : 400,
			y: narrow && multiple ? (index ? 1080 : 385) : index ? 420 : 465,
		}
		hubs.push(hub)
		const groups = Object.keys(COLORS).filter((id) =>
			members.some((v) => (v.group.value ?? 'unknown') === id),
		)
		if (sp.id === 'canephora') {
			const sorted = members.toSorted(
				(a, b) =>
					groups.indexOf(a.group.value ?? 'unknown') -
						groups.indexOf(b.group.value ?? 'unknown') ||
					a.name.localeCompare(b.name),
			)
			sorted.forEach((v, i) =>
				add(
					v,
					polar(
						hub.x,
						hub.y,
						r,
						-Math.PI / 2 + (i / sorted.length) * Math.PI * 2,
					),
					-Math.PI / 2 + (i / sorted.length) * Math.PI * 2,
					sp.id,
				),
			)
		} else {
			groups.forEach((group, index) => {
				const groupMembers = members.filter(
					(v) => (v.group.value ?? 'unknown') === group,
				)
				const direction =
					-Math.PI * 0.85 + (index / groups.length) * Math.PI * 2
				const center = polar(
					hub.x,
					hub.y,
					groups.length === 1 ? 100 : r * 0.72,
					direction,
				)
				const radius =
					groups.length === 1
						? r * 0.7
						: r * (0.15 + Math.sqrt(groupMembers.length) * 0.028)
				regions.push({
					id: `${sp.id}-${group}`,
					group,
					...center,
					r: radius + 20,
					count: groupMembers.length,
				})
				const anchor =
					groupMembers.find((v) => v.id === group) ??
					(group === 'sarchimor'
						? groupMembers.find((v) => v.id === 't5296')
						: undefined)
				const satellites = groupMembers.filter((v) => v !== anchor)
				if (anchor) add(anchor, center, direction, sp.id)
				satellites.forEach((v, i) => {
					const angle =
						direction + ((i + 0.5) / satellites.length) * Math.PI * 2
					add(v, polar(center.x, center.y, radius, angle), angle, sp.id)
				})
			})
		}
	})
	function add(
		v: Variety,
		point: { x: number; y: number },
		angle: number,
		hub: string,
	) {
		const children = RELATIONSHIPS.filter((edge) => edge.from === v.id).length
		nodes.push({
			id: v.id,
			...point,
			angle,
			hub,
			group: v.group.value ?? 'unknown',
			parent: children > 1,
			r: 5 + Math.sqrt(children) * 4,
		})
	}
	return { nodes, hubs, regions, width, height }
}
