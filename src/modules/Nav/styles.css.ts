import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const navContainer = style({
	position: 'fixed',
	top: vars.space.medium,
	left: 0,
	right: 0,
	display: 'grid',
	gridTemplateColumns: '1fr 3fr 1fr',
	// justifyContent: 'space-between',
	// alignItems: 'center',
	maxWidth: 1200,
	margin: '0 auto',
	padding: `${vars.space.medium} ${vars.space.large}`,
	height: vars.sizes.navBar,
	justifyItems: 'center',
	zIndex: 100,
	':focus': {
		// outline: 'none',
		// boxShadow: `inset 0 0 0 2px ${vars.colors.primary}`,
	},
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
})
