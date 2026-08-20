import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

/**
 * Shared call-to-action button for the home page cards. Lived in the X/Post
 * card until that card was replaced, which made unrelated cards depend on it.
 */
export const cardButton = style({
	display: 'flex',
	fontWeight: 'bold',
	alignItems: 'center',
	gap: vars.space.small,
	justifyContent: 'center',
	minHeight: vars.sizes.button,
	backgroundColor: 'rgba(0, 0, 0, 0.3)',
	boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.2)',
	borderRadius: `calc(${vars.borderRadius.large} + ${vars.space.large})`,
	transition: '300ms',
	':hover': {
		textDecoration: 'none',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.8)',
	},
})
