import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '@/app/theme.css'

export const dropdownText = style({
	minWidth: 'auto',
	lineHeight: 1.5,
	minHeight: 'auto',
	display: 'inline',
	textDecorationStyle: 'dotted',
	fontSize: vars.fontSize.large,
	textDecorationLine: 'underline',
	textDecorationColor: vars.colors.primary,
	':focus': {
		textDecorationLine: 'underline',
		textDecorationStyle: 'solid',
		textDecorationThickness: 3,
	},
})

export const dropdownContent = style({
	position: 'absolute',
})

globalStyle(`${dropdownText}:hover + ${dropdownContent}`, {
	zIndex: 1,
	left: '50%',
	maxWidth: 220,
	width: '10000%',
	position: 'absolute',
	flexDirection: 'column',
	padding: vars.space.large,
	display: 'flex !important',
	transform: 'translateX(-50%)',
	backgroundColor: vars.colors.background.regular,
	top: `calc(${vars.fontSize.large} + 4px)`,
	borderRadius: vars.borderRadius.large,
	boxShadow: vars.boxShadow.medium,
})
