import { glassOverImage } from '@/styles/glass.css'
import { press } from '@/styles/press.css'
import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

/**
 * Shared call-to-action button for the home page cards. Lived in the X/Post
 * card until that card was replaced, which made unrelated cards depend on it.
 */
export const cardButton = style([
	glassOverImage,
	press,
	{
		display: 'flex',
		color: 'white',
		fontWeight: vars.fontWeight.bold,
		alignItems: 'center',
		gap: vars.space.small,
		justifyContent: 'center',
		minHeight: vars.sizes.button,
		borderRadius: `calc(${vars.borderRadius.large} + ${vars.space.large})`,
		':hover': {
			textDecoration: 'none',
		},
	},
])
