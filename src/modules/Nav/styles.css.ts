import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

export const navContainer = style({
	left: 0,
	right: 0,
	zIndex: 100,
	display: 'grid',
	margin: '0 auto',
	position: 'fixed',
	justifyItems: 'center',
	top: vars.space.medium,
	gap: vars.space.medium,
	height: vars.sizes.navBar,
	maxWidth: vars.sizes.maxWidthPage,
	gridTemplateColumns: '1fr 3fr 1fr',
	padding: `${vars.space.medium} ${vars.space.large}`,
})

export const navList = style({
	display: 'grid',
	height: '100%',
	justifyContent: 'end',
	gridAutoFlow: 'column',
	padding: vars.space.small,
	boxShadow: vars.boxShadow.medium,
	borderRadius: vars.borderRadius.full,
	backgroundColor: vars.colors.background.content,
	justifySelf: 'end',
})

export const centerNavList = style([
	navList,
	{
		justifyContent: 'center',
		justifySelf: 'center',
	},
])

export const navItem = style({
	fontWeight: 'bolder',
})

export const navLink = style({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: vars.borderRadius.full,
	padding: `0 ${vars.space.large}`,
	color: vars.colors.text.secondary,
	cursor: 'pointer',
	':hover': {
		textDecoration: 'none',
	},
})

export const navLinkActive = style({
	color: vars.colors.text.regular,
	backgroundColor: vars.colors.background.regular,
	boxShadow: `0 2px 5px rgba(0, 0, 0, 0.05)`,
})

export const navToggleThemeItem = style({
	transition: 'transform 0.2s ease-in-out',
	backgroundColor: vars.colors.background.regular,
	transform: 'scale(1)',
	display: 'none',
	padding: 0,
	':hover': {
		transform: 'scale(0.9)',
	},
	':focus': {
		transform: 'scale(0.9)',
	},
	':active': {
		transform: 'scale(1)',
	},
	'@media': {
		'(min-width: 768px)': {
			display: 'inherit',
		},
	},
})
