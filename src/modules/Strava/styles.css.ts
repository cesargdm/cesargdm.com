import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

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
	fontWeight: 'bold',
	lineHeight: 1,
	fontSize: '3rem',
})

export const runName = style({
	textAlign: 'center',
	opacity: 0.8,
})

export const stravaButton = style({
	display: 'flex',
	color: 'white',
	fontWeight: 'bold',
	alignItems: 'center',
	gap: vars.space.small,
	justifyContent: 'center',
	minHeight: vars.sizes.button,
	backgroundColor: '#fc4c02',
	borderRadius: `calc(${vars.borderRadius.large} + ${vars.space.large})`,
	transition: '300ms',
	':hover': {
		textDecoration: 'none',
		backgroundColor: '#e34402',
	},
})
