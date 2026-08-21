import { style } from '@vanilla-extract/css'

import { glass } from '@/styles/glass.css'
import { vars } from '@/styles/theme.css'

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
		/*
		 * A grey wash laid over the glass. Left purely translucent the field took
		 * the colour of whatever sat behind it and stopped reading as an input;
		 * a background-image tints it without replacing the glass tint underneath.
		 */
		backgroundImage:
			'linear-gradient(light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.06)), light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.06)))',
	},
])
