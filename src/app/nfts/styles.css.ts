import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

export const nftsList = style({
	display: 'grid',
	gap: vars.space.large,
	gridTemplateColumns: 'repeat(2, 1fr)',
	'@media': {
		'screen and (min-width: 768px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
		'screen and (min-width: 1024px)': {
			gridTemplateColumns: 'repeat(4, 1fr)',
		},
		'screen and (min-width: 1280px)': {
			gridTemplateColumns: 'repeat(5, 1fr)',
		},
	},
})

export const nftItem = style({
	minWidth: 0,
	width: '100%',
	overflow: 'hidden',
	borderRadius: vars.borderRadius.large,
})

export const nftLink = style({
	height: '100%',
	display: 'block',
	textDecoration: 'none !important',
})

export const nftImageWrapper = style({
	width: '100%',
	height: 'auto',
	position: 'relative',
	aspectRatio: '1',
})

export const nftTextWrapper = style({
	height: '100%',
	display: 'flex',
	overflow: 'hidden',
	gap: vars.space.medium,
	flexDirection: 'column',
	padding: vars.space.large,
	backgroundColor: vars.colors.background.content,
})

export const nftName = style({
	lineClamp: 1,
	fontWeight: 'bold',
	WebkitLineClamp: 1,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
})

export const nftDescription = style({
	lineClamp: 2,
	WebkitLineClamp: 2,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
})
