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

const CELL_GAP = '2px'
const GAP_PX = 2
const WEEKDAYS = 7
const LEGEND_CELL_SIZE = '11px'
/*
 * Cells grow with the card but stop here. Past roughly twice GitHub's own 11px
 * they read as chunky tiles rather than a heatmap, and every pixel of cell is a
 * week less history on screen before you have to scroll.
 */
const MAX_CELL_SIZE = '18px'

/*
 * The card itself has no padding: the calendar runs to its edges the way the
 * reading shelf does, so a scroll reads as content continuing past the boundary
 * rather than stopping short of it. Everything that is not the scroller
 * therefore supplies its own inset.
 */
const INSET = vars.space.large

export const heading = style({
	padding: `${INSET} ${INSET} 0`,
	margin: 0,
})

/**
 * The total and the legend share a line: one is the figure the calendar adds up
 * to, the other is how to read its colours, and both are captions for the same
 * thing. Stacked separately they read as two unrelated asides.
 */
export const footer = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	gap: vars.space.medium,
	padding: `${vars.space.medium} ${INSET} 0`,
})

export const totalText = style({
	margin: 0,
	color: vars.colors.text.secondary,
	fontSize: vars.fontSize.small,
})

export const gridContainer = style({
	// A flex child defaults to min-width:auto, which is its content size — so the
	// grid's fit-content width pushed the card wider than its track instead of
	// scrolling inside it, and the page picked up a horizontal scrollbar.
	minWidth: 0,
	minHeight: 0,
	// Takes whatever vertical space the card has left, which is what the cells
	// then size themselves from.
	flex: 1,
	padding: `${vars.space.large} 0 0`,
	/*
	 * Three years never fits a card at a readable cell size, so the calendar
	 * scrolls — newest first, so the recent months are what is in view. The
	 * scrollbar is hidden because it reads as chrome under a heatmap.
	 */
	overflowX: 'auto',
	scrollbarWidth: 'none',
	'::-webkit-scrollbar': { display: 'none' },
})

export const grid = style({
	display: 'grid',
	gap: CELL_GAP,
	height: '100%',
	width: 'fit-content',
	padding: `0 ${INSET}`,
	/*
	 * Seven weekday rows sized from the height available, capped, plus one auto
	 * row for the year labels. Percentages here resolve against the grid's own
	 * height, so the cells grow with the card instead of being fixed.
	 *
	 * The labels live in this grid rather than a second one below it: they have to
	 * line up with the columns, and sharing the grid makes that structural instead
	 * of two templates that must be kept identical.
	 */
	gridTemplateRows: `repeat(${WEEKDAYS}, min(calc((100% - ${(WEEKDAYS - 1) * GAP_PX}px) / ${WEEKDAYS}), ${MAX_CELL_SIZE})) auto`,
	// Columns take their width from the cells, which are square.
	gridAutoColumns: 'auto',
	// Keeps the calendar centred in the leftover space once the cells hit the cap.
	alignContent: 'center',
})

export const yearLabel = style({
	gridRow: WEEKDAYS + 1,
	textAlign: 'center',
	paddingTop: vars.space.small,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.tertiary,
	// Two years can be a handful of columns wide at the edges of the range.
	overflow: 'hidden',
})

export const cell = style({
	height: '100%',
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
	height: LEGEND_CELL_SIZE,
	aspectRatio: '1',
})

export const legend = style({
	display: 'flex',
	alignItems: 'center',
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
	{
		// Pinned to the bottom of the card rather than trailing the calendar, so
		// it lines up with the call to action on every other card in the row.
		margin: `${vars.space.large} ${INSET} ${INSET}`,
		// Pinned to the bottom of the card rather than trailing the calendar, so
		// it lines up with the call to action on every other card in the row.
		marginBlockStart: 'auto',
	},
])
