import { vars } from '@/app/theme.css'

import { globalStyle, style } from '@vanilla-extract/css'

export const footerContainer = style({
	gap: vars.space.large,
	maxWidth: vars.sizes.maxWidthPage,
	padding: `${vars.space.xxxlarge} ${vars.space.large}`,
	paddingRight: `max(${vars.space.large}, env(safe-area-inset-right))`,
	paddingLeft: `max(${vars.space.large}, env(safe-area-inset-left))`,
	paddingBottom: `max(${vars.space.xxxlarge}, env(safe-area-inset-bottom))`,
	margin: `${vars.space.xxxlarge} auto 0`,
	display: 'flex',
	justifyContent: 'space-between',
})

export const footerList = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.xlarge,
})

export const footerParagraph = style({
	color: vars.colors.text.secondary,
	fontSize: vars.fontSize.small,
})

globalStyle(`${footerParagraph} b`, {
	display: 'block',
	fontSize: vars.fontSize.xsmall,
	textTransform: 'uppercase',
	marginBottom: vars.space.small,
})
