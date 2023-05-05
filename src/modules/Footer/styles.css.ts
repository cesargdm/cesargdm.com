import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '@/app/theme.css'

export const footerContainer = style({
	gap: vars.space.large,
	maxWidth: vars.sizes.maxWidthPage,
	padding: `${vars.space.xxxlarge} ${vars.space.large}`,
	margin: `${vars.space.xxxlarge} auto 0`,
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
