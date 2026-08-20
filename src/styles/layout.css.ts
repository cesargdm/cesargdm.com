import { vars } from '@/styles/theme.css'

import { globalStyle, style } from '@vanilla-extract/css'

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
const MAX_TRACKED_COLUMNS = 6

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

/** Container queries assigning a span per column count, widest match winning. */
function spanPerColumnCount(spanFor: (columns: number) => number) {
	const queries: Record<string, { gridColumn: string }> = {}

	for (let columns = 2; columns <= MAX_TRACKED_COLUMNS; columns++) {
		queries[`bento (min-width: ${widthForColumns(columns)})`] = {
			gridColumn: `span ${spanFor(columns)}`,
		}
	}

	return queries
}

export const cardsList = style({
	display: 'grid',
	gap: `${GAP_PX}px`,
	alignItems: 'flex-start',
	/*
	 * The column count comes from the width available rather than from two
	 * hardcoded breakpoints, so a 1200px window and a 1600px one do not both get
	 * four increasingly-stretched columns.
	 *
	 * `min(100%, …)` keeps the floor from ever exceeding the container, which is
	 * what stops a narrow phone from overflowing instead of dropping to one
	 * column.
	 */
	gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${CARD_MIN_WIDTH}), 1fr))`,
	/*
	 * Wide cards leave holes when they cannot fit on the current row. Dense
	 * packing backfills those with whatever card comes next and fits — which is
	 * the whole point of a bento layout, and why an empty slot used to sit next
	 * to the reading shelf.
	 */
	gridAutoFlow: 'dense',
	// Lets the cards below size their spans from this box's width.
	containerType: 'inline-size',
	containerName: 'bento',
})

/** Two columns once two exist; one below that. */
export const twoColumnCard = style({
	'@container': spanPerColumnCount(() => 2),
})

/**
 * For a card whose content is a wide series rather than a block — the
 * contribution graph is three years across, and in a single column its cells
 * are unreadable.
 *
 * The span is chosen to tile against the other wide cards, which are two tracks
 * each. On an even column count, two tracks pairs with them exactly and the row
 * fills; taking more would strand the shelf beside it with empty tracks. On an
 * odd count a single track is always left over regardless, so the card may as
 * well take everything but that one and let a small card fill the remainder.
 *
 * Measured at 1200px: at three tracks the reading shelf sat alone with two empty
 * columns and the graph below it with one; at two, the two cards tile the row.
 */
export const wideCard = style({
	'@container': spanPerColumnCount((columns) =>
		columns % 2 === 0 ? 2 : Math.max(2, columns - 1),
	),
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
