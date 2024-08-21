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
	gap: vars.space.medium,
	height: vars.sizes.navBar,
	maxWidth: vars.sizes.maxWidthPage,
	gridTemplateColumns: 'auto 3fr auto',
	padding: vars.space.medium,
	paddingRight: `max(${vars.space.large}, env(safe-area-inset-right))`,
	paddingLeft: `max(${vars.space.large}, env(safe-area-inset-left))`,
	paddingTop: `max(${vars.space.medium}, env(safe-area-inset-top))`,
})

export const floatingList = style({
	padding: vars.space.small,
	boxShadow: vars.boxShadow.medium,
	borderRadius: vars.borderRadius.full,
	backgroundColor: vars.colors.background.content,
})

export const navList = style([
	floatingList,
	{
		display: 'grid',
		height: '100%',
		justifyContent: 'end',
		gridAutoFlow: 'column',
		justifySelf: 'end',
	},
])

export const searchList = style([
	floatingList,
	{
		paddingTop: vars.space.medium,
		paddingBottom: vars.space.medium,
		backgroundColor: vars.colors.background.regular,
		borderRadius: vars.borderRadius.xlarge,
		width: 'min(var(--radix-popover-content-available-height), 800px)',
		maxHeight: 'var(--radix-popover-content-available-height)',
	},
])

export const centerNavList = style([
	navList,
	{
		justifyContent: 'center',
		justifySelf: 'center',
		position: 'relative',
		overflowX: 'auto',
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
	opacity: 1,
	transition: 'opacity 300ms',
	':hover': {
		textDecoration: 'none',
		opacity: 0.8,
	},
	':focus': {
		opacity: 0.8,
	},
})

export const navLinkActive = style({
	color: vars.colors.text.regular,
	backgroundColor: vars.colors.background.regular,
	boxShadow: `0 2px 5px rgba(0, 0, 0, 0.05)`,
})

export const navToggleThemeItem = style({
	transition: 'transform 300ms',
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
