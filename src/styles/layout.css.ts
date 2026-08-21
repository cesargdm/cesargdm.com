import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

/*
 * Off-screen until keyboard-focused, then dropped in above everything else —
 * the standard skip-link pattern. A sighted mouse user never sees it; a
 * keyboard/AT user tabbing from the top of the page gets it as the very
 * first stop, before the nav's own controls.
 */
export const skipLink = style({
	position: 'fixed',
	top: vars.space.small,
	left: vars.space.small,
	zIndex: 1000,
	padding: `${vars.space.small} ${vars.space.medium}`,
	borderRadius: vars.borderRadius.medium,
	backgroundColor: vars.colors.background.content,
	color: vars.colors.text.regular,
	boxShadow: vars.boxShadow.medium,
	transform: 'translateY(-200%)',
	selectors: {
		'&:focus-visible': {
			transform: 'translateY(0)',
		},
	},
})

export const content = style({
	margin: '0 auto',
	padding: vars.space.large,
	paddingRight: `max(${vars.space.large}, env(safe-area-inset-right))`,
	paddingLeft: `max(${vars.space.large}, env(safe-area-inset-left))`,
	maxWidth: vars.sizes.maxWidthPage,
	paddingTop: `calc(${vars.sizes.navBar} + ${vars.space.xxlarge})`,
})

export const errorPageContainer = style({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: vars.space.xlarge,
})

export const body = style({
	color: vars.colors.text.regular,
	backgroundColor: vars.colors.background.regular,
})

export const dropdownText = style({
	minWidth: 'auto',
	lineHeight: 1.5,
	display: 'inline',
	minHeight: 'auto',
	fontSize: vars.fontSize.large,
	textDecorationStyle: 'dotted',
	textDecorationLine: 'underline',
	textDecorationColor: vars.colors.primary,
})

export const card = style({
	// Same reason as the scroller inside it: a grid item defaults to a minimum
	// of its content size, so a card whose content is wide would stretch its
	// track rather than clipping.
	minWidth: 0,
	// A grid item's automatic minimum is its content height, which let a card
	// taller than one track push its whole row and stretch the squares in it.
	// The cards clip and scroll internally, so the row size stays authoritative.
	minHeight: 0,
	// A card is never wider than its track. Stretching sets a square card's
	// height, and aspect-ratio then derives a width back from it — which burst
	// the track by 28px and put a scrollbar on the page.
	maxWidth: '100%',
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	flexDirection: 'column',
	padding: vars.space.large,
	borderRadius: vars.borderRadius.xlarge,
	backgroundColor: vars.colors.background.content,
})

const CARD_MIN_WIDTH_PX = 260
const CARD_MIN_WIDTH = `${CARD_MIN_WIDTH_PX}px`
const GAP_PX = 16
const MAX_COLUMNS = 4

/*
 * A quarter of the row, gaps discounted. Used as the track floor so `auto-fill`
 * can never fit a fifth column: past four, the floor grows with the container
 * instead of letting more tracks in. Below that the fixed minimum takes over and
 * the count falls to three, two, one.
 */
const QUARTER_TRACK = `calc((100% - ${(MAX_COLUMNS - 1) * GAP_PX}px) / ${MAX_COLUMNS})`

/**
 * The container width at which `columns` tracks first fit, gaps included.
 *
 * Spans are keyed off the grid's own width rather than the viewport's: the list
 * sits inside a padded, max-width page, so those two numbers are never the same
 * and a viewport breakpoint would always be approximating.
 */
function widthForColumns(columns: number) {
	return `${columns * CARD_MIN_WIDTH_PX + (columns - 1) * GAP_PX}px`
}

/**
 * The bento's container. It sits on the wrapper rather than on the grid itself
 * because an element cannot query its own container — putting it on the list
 * meant the list's own `@container` rules silently never matched.
 */
export const cardsContainer = style({
	containerType: 'inline-size',
	containerName: 'bento',
})

/** One track's width at `columns`, read off the container. */
function trackWidth(columns: number) {
	return `calc((100cqw - ${(columns - 1) * GAP_PX}px) / ${columns})`
}

/*
 * Rows are exactly one track tall, so a single-track card is square and a
 * two-track card is a 2×1 tile. Left to itself a row took the height of its
 * tallest card and stretched the squares in it — 280×308 in the row holding the
 * chat.
 */
const squareRows = Object.fromEntries(
	Array.from({ length: MAX_COLUMNS - 1 }, (unused, index) => {
		const columns = index + 2

		return [
			`bento (min-width: ${widthForColumns(columns)})`,
			{ gridAutoRows: trackWidth(columns) },
		]
	}),
)

export const cardsList = style({
	display: 'grid',
	gap: `${GAP_PX}px`,
	// Every card takes the height of its row rather than of its own content, so a
	// row reads as a row instead of a ragged set of boxes.
	alignItems: 'stretch',
	/*
	 * The column count comes from the width available rather than from hardcoded
	 * breakpoints — but caps at four, past which the cards stop being cards and
	 * start being tiles.
	 *
	 * `min(100%, …)` keeps the floor from ever exceeding the container, which is
	 * what stops a narrow phone from overflowing instead of dropping to one column.
	 */
	gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, max(${CARD_MIN_WIDTH}, ${QUARTER_TRACK})), 1fr))`,
	/*
	 * Wide cards leave holes when they cannot fit on the current row. Dense
	 * packing backfills those with whatever card comes next and fits — the card
	 * order is arranged so there is nothing left to backfill, but this keeps a
	 * stray gap from appearing if a card is added or an integration goes quiet.
	 */
	gridAutoFlow: 'dense',
	'@container': squareRows,
})

/**
 * Two tracks once two exist, one below that.
 *
 * Four columns is the cap and the wide cards are all two tracks, so they tile
 * against each other at every count — there is no width at which a card wants
 * three.
 */
export const twoColumnCard = style({
	'@container': {
		[`bento (min-width: ${widthForColumns(2)})`]: {
			gridColumn: 'span 2',
		},
	},
})

/**
 * A single-track card is square. The ratio is what gives the grid its rhythm;
 * without it a card with little content collapses to its text and the row
 * becomes a letterbox.
 *
 * It only applies once there is more than one column — at one column the card is
 * the full width of the page, and a square that tall is absurd.
 */
export const squareCard = style({
	'@container': {
		[`bento (min-width: ${widthForColumns(2)})`]: {
			aspectRatio: '1 / 1',
		},
	},
})

export const introParagraph = style({
	lineHeight: 1.6,
	marginTop: vars.space.medium,
	fontSize: vars.fontSize.large,
	maxWidth: 760,
	color: vars.colors.text.secondary,
})

export const introContainer = style({
	maxWidth: 860,
	margin: '0 auto',
	minHeight: '56svh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	paddingBottom: vars.space.xxlarge,
})

/*
 * An integration that has no data renders nothing, but its <li> still carried
 * the card's padding and background — which showed up as a blank card. A card
 * with no element children has nothing to show, so it does not get a slot.
 */
globalStyle(`.${cardsList} > .${card}:not(:has(*))`, {
	display: 'none',
})
