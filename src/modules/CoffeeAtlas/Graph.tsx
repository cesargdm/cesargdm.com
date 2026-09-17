/* SVG groups need button semantics; HTML buttons cannot wrap SVG geometry. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { drag } from 'd3-drag'
import type { D3DragEvent } from 'd3-drag'
import { select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'
import type { ZoomBehavior } from 'd3-zoom'
import { useEffect, useMemo, useRef, useState } from 'react'

import { GROUPS, RELATIONSHIPS, SPECIES, VARIETIES } from '@/lib/coffee/data'
import type { Variety } from '@/lib/coffee/data'
import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

import { coffeeLayout, COLORS } from './layout'
import type { Point } from './layout'
import * as s from './styles.css'

type Props = {
	records: Variety[]
	species: string
	selected: string
	locale: Locale
	expanded: boolean
	onSpecies: (id: string) => void
	onSelect: (id: string) => void
}
export default function Graph({
	records,
	species,
	selected,
	locale,
	expanded,
	onSpecies,
	onSelect,
}: Props) {
	const t = getTranslate(locale)
	const svg = useRef<SVGSVGElement>(null)
	const layer = useRef<SVGGElement>(null)
	const behavior = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
	const [size, setSize] = useState({ width: 700, height: 580 })
	const [offsets, setOffsets] = useState<
		Record<string, { x: number; y: number }>
	>({})
	useEffect(() => {
		const element = svg.current
		if (!element) return
		const observer = new ResizeObserver(([entry]) => {
			if (entry.contentRect.width)
				setSize({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				})
		})
		observer.observe(element)
		return () => observer.disconnect()
	}, [])
	const narrow = size.width < 540
	const [zoomed, setZoomed] = useState(false)
	const layout = useMemo(() => coffeeLayout(records, narrow), [records, narrow])
	const largeScale = 1
	const nodes: Point[] = layout.nodes.map((n) => ({ ...n, ...offsets[n.id] }))
	useEffect(() => {
		if (!svg.current) return
		const element = select(svg.current)
		const controller = zoom<SVGSVGElement, unknown>()
			.extent([
				[0, 0],
				[layout.width, layout.height],
			])
			.scaleExtent([0.5, 6])
			.filter((event) => {
				if (event.type.startsWith('touch'))
					return expanded || event.touches.length >= 2
				return !event.button
			})
			.on('zoom', (event) => {
				setZoomed(event.transform.k > 1.6)
				if (layer.current)
					select(layer.current).attr('transform', event.transform.toString())
			})
		element.call(controller).on('dblclick.zoom', null)
		behavior.current = controller
		return () => {
			element.on('.zoom', null)
			behavior.current = null
		}
	}, [layout.width, layout.height, expanded])
	useEffect(() => {
		setOffsets({})
		if (svg.current && behavior.current)
			behavior.current.transform(select(svg.current), zoomIdentity)
	}, [layout])
	useEffect(() => {
		if (!layer.current) return
		const elements = select(layer.current).selectAll<SVGGElement, Point>(
			'g[data-variety]',
		)
		elements.each(function bindPoint() {
			select(this).datum(nodes.find((n) => n.id === this.dataset.variety)!)
		})
		const controller = drag<SVGGElement, Point>()
			.clickDistance(6)
			.filter(
				(event) =>
					!event.button && (!event.type.startsWith('touch') || expanded),
			)
			.on('drag', (event: D3DragEvent<SVGGElement, Point, Point>, d) =>
				setOffsets((old) => ({ ...old, [d.id]: { x: event.x, y: event.y } })),
			)
		elements.call(controller)
		return () => {
			elements.on('.drag', null)
		}
	}, [nodes, expanded])
	const connected = new Set([
		selected,
		...RELATIONSHIPS.filter(
			(e) => e.from === selected || e.to === selected,
		).flatMap((e) => [e.from, e.to]),
	])
	function adjust(factor: number) {
		if (svg.current && behavior.current)
			behavior.current.scaleBy(select(svg.current), factor)
	}
	function fit() {
		setOffsets({})
		if (svg.current && behavior.current)
			behavior.current.transform(select(svg.current), zoomIdentity)
	}
	return (
		<>
			<svg
				ref={svg}
				viewBox={`0 0 ${layout.width} ${layout.height}`}
				style={narrow ? { height: species ? 580 : 850 } : undefined}
				className={s.canvas}
				data-expanded={expanded}
				aria-label={t('coffee.graph')}
			>
				<defs>
					<marker
						id="coffee-arrow"
						viewBox="0 0 10 10"
						refX="10"
						refY="5"
						markerWidth="4"
						markerHeight="4"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
					</marker>
				</defs>
				<g ref={layer}>
					{layout.hubs.map((hub) => (
						<circle
							key={hub.id}
							cx={hub.x}
							cy={hub.y}
							r={hub.r + 55}
							fill="currentColor"
							fillOpacity={0.025}
						/>
					))}
					{layout.regions.map((region) => (
						<g key={region.id} aria-hidden="true">
							<circle
								cx={region.x}
								cy={region.y}
								r={region.r}
								fill={COLORS[region.group]}
								fillOpacity={0.075}
							/>
							<text
								x={region.x}
								y={region.y - region.r - 10}
								textAnchor="middle"
								fill={COLORS[region.group]}
								fontSize={10}
								letterSpacing="1"
							>
								{GROUPS[region.group]?.[locale] ?? t('coffee.unknown')}
							</text>
						</g>
					))}
					{RELATIONSHIPS.map((edge) => {
						const a = nodes.find((n) => n.id === edge.from)
						const b = nodes.find((n) => n.id === edge.to)
						if (!a || !b) return null
						const angle = Math.atan2(b.y - a.y, b.x - a.x)
						return (
							<path
								key={`${edge.from}-${edge.to}`}
								d={`M${a.x + Math.cos(angle) * a.r},${a.y + Math.sin(angle) * a.r} Q${(a.x + b.x) / 2 + Math.sin(angle) * 24},${(a.y + b.y) / 2 - Math.cos(angle) * 24} ${b.x - Math.cos(angle) * (b.r + 4)},${b.y - Math.sin(angle) * (b.r + 4)}`}
								fill="none"
								stroke={
									selected
										? edge.to === selected
											? '#679bb0'
											: '#c99047'
										: 'currentColor'
								}
								strokeOpacity={
									!selected || edge.from === selected || edge.to === selected
										? selected
											? 0.95
											: 0.42
										: 0.12
								}
								strokeWidth={
									selected && (edge.from === selected || edge.to === selected)
										? 2.5
										: 1
								}
								strokeDasharray={
									edge.type === 'mutation'
										? '5 4'
										: edge.type === 'selection'
											? '2 4'
											: undefined
								}
								markerEnd="url(#coffee-arrow)"
							>
								<title>{`${VARIETIES.find((v) => v.id === edge.from)?.name} → ${VARIETIES.find((v) => v.id === edge.to)?.name}: ${t(`coffee.${edge.type}`)}`}</title>
							</path>
						)
					})}
					{nodes.map((n) => {
						const v = VARIETIES.find((record) => record.id === n.id)!
						return (
							<g
								key={n.id}
								data-variety={n.id}
								style={{
									transform: `translate(${n.x}px,${n.y}px)`,
									transition: 'none',
								}}
								className={s.node}
								role="button"
								tabIndex={0}
								aria-label={v.name}
								aria-pressed={selected === n.id}
								onClick={(e) => {
									if (!e.defaultPrevented) onSelect(n.id)
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										onSelect(n.id)
									}
								}}
								opacity={!selected || connected.has(n.id) ? 1 : 0.45}
							>
								<circle r={Math.max(n.r + 5, 12)} fill="transparent" />
								<circle
									r={n.r * (selected === n.id ? 2.4 : 2)}
									fill={COLORS[n.group]}
									fillOpacity={selected === n.id ? 0.25 : 0.12}
								/>
								<circle
									r={n.r}
									fill={COLORS[n.group]}
									stroke={selected === n.id ? 'currentColor' : COLORS[n.group]}
									strokeWidth={selected === n.id ? 2 : 0}
								/>
								<title>{v.name}</title>
								{(zoomed ||
									n.parent ||
									v.featured ||
									selected === n.id ||
									(selected && connected.has(n.id)) ||
									(!narrow && n.hub === 'canephora')) && (
									<text
										transform={
											n.parent || selected === n.id
												? undefined
												: `rotate(${(n.angle * 180) / Math.PI + (Math.cos(n.angle) < 0 ? 180 : 0)})`
										}
										x={
											n.parent || selected === n.id
												? n.r + 8
												: (Math.cos(n.angle) < 0 ? -1 : 1) * (n.r + 7)
										}
										y={4}
										textAnchor={
											n.parent || selected === n.id || Math.cos(n.angle) >= 0
												? 'start'
												: 'end'
										}
										fill="currentColor"
										fontSize={n.parent || selected === n.id ? 13 : 10}
										fontWeight={n.parent || selected === n.id ? 600 : 400}
									>
										{v.name}
									</text>
								)}
							</g>
						)
					})}{' '}
					{layout.hubs.map((hub) => {
						const sp = SPECIES.find((item) => item.id === hub.id)!
						return (
							<g
								key={hub.id}
								role="button"
								tabIndex={0}
								className={s.node}
								style={{ transform: 'none', transition: 'none' }}
								aria-label={`${sp.name}: ${hub.count} ${t('coffee.records')}`}
								onClick={() => onSpecies(sp.id)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										onSpecies(sp.id)
									}
								}}
							>
								<circle
									cx={hub.x}
									cy={hub.y}
									r={35 + Math.sqrt(hub.count) * 3}
									fill="var(--atlas-surface)"
									stroke={sp.color}
									strokeOpacity={0.4}
								/>
								<text
									x={hub.x}
									y={hub.y - 3}
									textAnchor="middle"
									fill="currentColor"
									fontFamily="inherit"
									fontSize={19}
								>
									{sp.name}
								</text>
								<text
									x={hub.x}
									y={hub.y + 18 * largeScale}
									textAnchor="middle"
									fill="currentColor"
									opacity={0.6}
									fontSize={10 * largeScale}
								>
									{hub.count} {t('coffee.records')}
								</text>
								{!species && (
									<text
										x={hub.x}
										y={hub.y + 36 * largeScale}
										textAnchor="middle"
										fill="currentColor"
										fontSize={10 * largeScale}
									>
										{t('coffee.enter')} ↗
									</text>
								)}
							</g>
						)
					})}
				</g>
			</svg>
			<div className={s.familyLegend}>
				{[...new Set(records.map((v) => v.group.value ?? 'unknown'))].map(
					(id) => (
						<span key={id}>
							<i style={{ background: COLORS[id] }} />
							{GROUPS[id]?.[locale] ?? t('coffee.unknown')}
						</span>
					),
				)}
			</div>
			<div className={s.controls}>
				<button
					className={s.button}
					type="button"
					aria-label={t('coffee.zoomOut')}
					onClick={() => adjust(0.8)}
				>
					−
				</button>
				<button
					className={s.button}
					type="button"
					aria-label={t('coffee.zoomIn')}
					onClick={() => adjust(1.25)}
				>
					+
				</button>
				<button className={s.button} type="button" onClick={fit}>
					{t('coffee.fit')}
				</button>
			</div>
		</>
	)
}
