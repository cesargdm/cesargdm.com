import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '@/app/theme.css'

export const dropdownText = style({
	// bottom line
	textDecorationLine: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationColor: vars.colors.primary,
	minHeight: 'auto',
	minWidth: 'auto',
	lineHeight: 1.5,
	fontSize: vars.fontSize.large,
	display: 'inline',
})

export const dropdownContent = style({
	display: 'none',
	position: 'absolute',
})

globalStyle(`${dropdownText}:hover + ${dropdownContent}`, {
	backgroundColor: vars.colors.background.regular,
	display: 'flex',
	zIndex: 1,
	padding: vars.space.large,
	top: `calc(${vars.fontSize.large} + 4px)`,
	left: '50%',
	flexDirection: 'column',
	position: 'absolute',
	transform: 'translateX(-50%)',
	borderRadius: vars.borderRadius.large,
	boxShadow: vars.boxShadow.medium,
	maxWidth: 220,
	width: '10000%',
})
