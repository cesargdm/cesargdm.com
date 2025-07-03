import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

export const stravaContainer = style({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	padding: vars.space.large,
	gap: vars.space.medium,
})

export const stravaIcon = style({
	width: 24,
	height: 24,
	color: '#fc4c02', // Strava orange
})

export const statsGrid = style({
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: vars.space.medium,
	flex: 1,
})

export const statItem = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	textAlign: 'center',
	gap: vars.space.small,
})

export const statValue = style({
	fontSize: vars.fontSize.xlarge,
	fontWeight: 'bold',
	color: '#fc4c02', // Strava orange
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
	backgroundColor: '#fc4c02', // Strava orange
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