import { cardButton } from '@/modules/card.css'

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

const CELL_SIZE = '11px'
const CELL_GAP = '3px'

export const totalText = style({
	margin: 0,
	color: vars.colors.text.secondary,
	fontSize: vars.fontSize.small,
})

export const gridContainer = style({
	overflowX: 'auto',
	padding: `${vars.space.medium} 0`,
})

export const grid = style({
	display: 'grid',
	gap: CELL_GAP,
	width: 'fit-content',
	gridAutoFlow: 'column',
	gridAutoColumns: CELL_SIZE,
	gridTemplateRows: `repeat(7, ${CELL_SIZE})`,
})

export const cell = style({
	width: CELL_SIZE,
	height: CELL_SIZE,
	borderRadius: '2px',
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

export const legend = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: CELL_GAP,
	margin: 0,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.tertiary,
})

export const legendLabel = style({
	padding: `0 ${vars.space.small}`,
})

export const githubButton = style([
	cardButton,
	{
		color: 'white',
		boxShadow: 'none',
		backgroundColor: '#24292f',
		':hover': {
			boxShadow: 'none',
			backgroundColor: '#171515',
		},
	},
])
