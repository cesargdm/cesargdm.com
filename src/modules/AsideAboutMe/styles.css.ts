import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

export const socialLink = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space.small,
	alignItems: 'center',
})

export const smallDescription = style({
	fontSize: vars.fontSize.small,
	color: vars.colors.text.secondary,
	marginBottom: vars.space.medium,
	lineHeight: '1.5',
})

export const sitename = style({
	fontSize: vars.fontSize.large,
	fontWeight: vars.fontWeight.bold,
	marginBottom: vars.space.medium,
})

export const socialLinksList = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space.medium,
	marginBottom: vars.space.medium,
})
