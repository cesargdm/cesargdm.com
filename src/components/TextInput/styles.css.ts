import { glass } from '@/styles/glass.css'
import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

export const textInput = style([
	glass,
	{
		width: '100%',
		display: 'block',
		textAlign: 'left',
		padding: vars.space.large,
		paddingTop: vars.space.small,
		fontSize: vars.fontSize.medium,
		paddingBottom: vars.space.small,
		color: vars.colors.text.regular,
		borderRadius: vars.borderRadius.full,
		border: 'none',
	},
])
