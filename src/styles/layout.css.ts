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

export const cardsList = style({
	display: 'grid',
	gap: vars.space.large,
	gridTemplateColumns: '1fr',
	alignItems: 'flex-start',
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
		'(min-width: 1024px)': {
			gridTemplateColumns: 'repeat(4, 1fr)',
		},
	},
})

export const twoColumnCard = style({
	'@media': {
		'(min-width: 768px)': {
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
	'@media': {
		'(min-width: 768px)': {
			gridColumn: 'span 3',
		},
		'(min-width: 1024px)': {
			gridColumn: 'span 4',
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
