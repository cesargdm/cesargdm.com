import { style } from '@vanilla-extract/css'

import { glassTint } from '@/styles/glass-tint.css'
import { press } from '@/styles/press.css'
import { vars } from '@/styles/theme.css'

export const runContainer = style({
	display: 'flex',
	flex: 1,
	margin: 'auto',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space.small,
	padding: `${vars.space.large} 0`,
})

export const distanceText = style({
	fontWeight: vars.fontWeight.bold,
	lineHeight: 1,
	fontSize: vars.fontSize.xlarge,
})

export const distanceUnit = style({
	fontSize: vars.fontSize.large,
})

export const runName = style({
	textAlign: 'center',
	opacity: 0.8,
})

export const stravaButton = style([
	glassTint('rgba(176, 60, 0, 0.88)', 'rgba(140, 48, 0, 0.94)'),
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
