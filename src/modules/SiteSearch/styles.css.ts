import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const resultList = style({
	listStyle: 'none',
	padding: 0,
	margin: 0,
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.large,
})

export const resultItem = style({
	paddingBottom: vars.space.large,
	borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
})

export const resultLink = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.small,
	textDecoration: 'none',
})

export const typeBadge = style({
	display: 'inline-flex',
	padding: '2px 8px',
	borderRadius: 999,
	backgroundColor: 'rgba(128, 128, 128, 0.2)',
	fontSize: vars.fontSize.xsmall,
	fontWeight: vars.fontWeight.bold,
	textTransform: 'uppercase',
	alignItems: 'center',
})
