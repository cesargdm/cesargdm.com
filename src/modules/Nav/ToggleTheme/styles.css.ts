import { glassInteractive } from '@/styles/glass.css'
import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

export const toggleTheme = style([
	glassInteractive,
	{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: vars.borderRadius.full,
		height: 48,
		width: 48,
	},
])
