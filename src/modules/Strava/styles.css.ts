import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

const stravaOrange = '#fc4c02'

export const stravaContainer = style({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	gap: vars.space.medium,
})

export const stravaIcon = style({
	width: 24,
	height: 24,
	color: stravaOrange,
})

export const statItem = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	textAlign: 'center',
	gap: vars.space.medium,
	flex: 1,
	justifyContent: 'center',
})

export const statValue = style({
	fontSize: vars.fontSize.xxlarge,
	fontWeight: 'bold',
	color: stravaOrange,
})

export const statLabel = style({
	fontSize: vars.fontSize.small,
	color: vars.colors.text.secondary,
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
})

export const viewProfileButton = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: vars.sizes.button,
	backgroundColor: stravaOrange,
	color: 'white',
	borderRadius: vars.borderRadius.large,
	fontWeight: 'bold',
	textDecoration: 'none',
	transition: '300ms',
	':hover': {
		backgroundColor: '#e43c00',
		textDecoration: 'none',
	},
})
