import { cardButton } from '@/modules/card.css'

import { glassTint } from '@/styles/glass.css'
import { vars } from '@/styles/theme.css'

import { style, styleVariants } from '@vanilla-extract/css'

/*
 * GitHub's own calendar palette, light value first. `light-dark()` keys off
 * `color-scheme`, which theme.css.ts pins to each theme class — so these follow
 * the site's toggle rather than the operating system.
 *
 * The previous version tinted the site's blue by opacity, which produced a
 * gradient that read as "some chart" rather than a contribution graph. The
 * green scale is the recognisable part; it is what makes the widget legible at
 * a glance without a caption.
 */
const LEVEL_COLORS = [
	'light-dark(#ebedf0, #161b22)',
	'light-dark(#9be9a8, #0e4429)',
	'light-dark(#40c463, #006d32)',
	'light-dark(#30a14e, #26a641)',
	'light-dark(#216e39, #39d353)',
]

// Three years is roughly 160 columns, which does not fit a card at any fixed
// cell size — so the cells are fluid and the whole span fits without scrolling.
// The legend keeps a fixed size, since it is five cells rather than a year.
const CELL_GAP = '2px'
const LEGEND_CELL_SIZE = '11px'

export const totalText = style({
	margin: 0,
	color: vars.colors.text.secondary,
	fontSize: vars.fontSize.small,
})

export const gridContainer = style({
	padding: `${vars.space.medium} 0`,
})

const GRID_COLUMNS = 'repeat(var(--columns), minmax(0, 1fr))'

export const grid = style({
	display: 'grid',
	gap: CELL_GAP,
	width: '100%',
	gridTemplateColumns: GRID_COLUMNS,
})

export const yearAxis = style({
	display: 'grid',
	gap: CELL_GAP,
	width: '100%',
	// Same template as the grid above, so each label sits under its own year.
	gridTemplateColumns: GRID_COLUMNS,
	marginTop: vars.space.small,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.tertiary,
})

export const yearLabel = style({
	textAlign: 'center',
})

export const cell = style({
	width: '100%',
	aspectRatio: '1',
	borderRadius: '1px',
	// GitHub outlines every cell, including empty ones, so the grid reads as a
	// grid rather than as scattered marks on the card background.
	outline:
		'1px solid light-dark(rgba(27, 31, 35, 0.06), rgba(255, 255, 255, 0.05))',
	outlineOffset: '-1px',
})

// Built from the palette rather than spelled out, so the two cannot drift and
// the level indices are not five bare literals.
export const cellLevels = styleVariants(
	Object.fromEntries(
		LEVEL_COLORS.map((color, level) => [level, { backgroundColor: color }]),
	),
)

export const legendCell = style({
	width: LEGEND_CELL_SIZE,
	aspectRatio: '1',
})

export const legend = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: '3px',
	margin: 0,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.tertiary,
})

export const legendLabel = style({
	padding: `0 ${vars.space.small}`,
})

export const githubButton = style([
	cardButton,
	glassTint('rgba(36, 41, 47, 0.88)', 'rgba(23, 21, 21, 0.94)'),
])
