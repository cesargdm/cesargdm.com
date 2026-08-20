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
// A media feature cannot take calc(), so the two-column threshold is computed
// here and interpolated as a literal.
const TWO_COLUMN_WIDTH = `${CARD_MIN_WIDTH_PX * 2}px`

export const cardsList = style({
	display: 'grid',
	gap: vars.space.large,
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
})

export const twoColumnCard = style({
	'@media': {
		// Two columns only exist once the grid is wide enough for two tracks;
		// below that the span would force an implicit column and overflow.
		[`(min-width: ${TWO_COLUMN_WIDTH})`]: {
			gridColumn: 'span 2',
		},
	},
})

/**
 * For a card whose content is a wide series rather than a block — the
 * contribution graph is three years across, and at half a row its cells shrink
 * to a couple of pixels.
 */
export const fullWidthCard = style({
	// Whatever the column count turns out to be — no breakpoint needs to know it.
	gridColumn: '1 / -1',
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
