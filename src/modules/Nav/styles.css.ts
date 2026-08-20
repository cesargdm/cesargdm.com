import { glass } from '@/styles/glass.css'
import { press } from '@/styles/press.css'
import { vars } from '@/styles/theme.css'

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

export const floatingList = style([
	glass,
	{
		padding: vars.space.small,
		borderRadius: vars.borderRadius.full,
	},
])

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
	fontWeight: vars.fontWeight.bold,
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
	// A darkening wash rather than an opaque fill, so whatever is refracting
	// through the pill still shows behind the current item.
	backgroundColor: 'rgba(0, 0, 0, 0.25)',
	boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
})

/*
 * The wrapper used to shrink on hover and spring back to full size on press,
 * which is the press metaphor backwards. The button inside is glass and already
 * presses in; the wrapper only has to stop fighting it — and stop painting an
 * opaque background over the glass.
 */
export const navToggleThemeItem = style({
	display: 'none',
	padding: 0,
	'@media': {
		'(min-width: 768px)': {
			display: 'inherit',
		},
	},
})

export const backButton = style([
	glass,
	press,
	{
		alignItems: 'center',
		gap: vars.space.small,
		justifySelf: 'start',
		height: vars.sizes.button,
		padding: `0 ${vars.space.large} 0 ${vars.space.medium}`,
		borderRadius: vars.borderRadius.full,
		color: vars.colors.text.regular,
		fontWeight: vars.fontWeight.bold,
		// The nav is three slots wide; below the tablet breakpoint the middle one
		// needs every pixel, and the browser's own back gesture covers this.
		display: 'none',
		'@media': {
			'(min-width: 768px)': {
				display: 'flex',
			},
		},
		':hover': {
			textDecoration: 'none',
		},
	},
])
