import { vars } from '@/app/theme.css'

import { cardButton } from '../LastTweet/styles.css'
import { globalStyle, style } from '@vanilla-extract/css'

export const photosWrapper = style({
	width: '100%',
	display: 'grid',
	overflowX: 'auto',
	overflowY: 'hidden',
	gridAutoFlow: 'column',
	gridAutoColumns: '100%',
	scrollSnapType: 'x mandatory',
	'::-webkit-scrollbar': {
		display: 'none',
		width: 0,
		background: 'transparent',
	},
})

export const morePhotosButton = style([
	cardButton,
	{
		color: 'white',
		position: 'absolute',
		left: vars.space.large,
		right: vars.space.large,
		bottom: `calc(${vars.sizes.button} * -1)`,
	},
])

globalStyle(
	`${photosWrapper}:hover + ${morePhotosButton}, ${morePhotosButton}:hover`,
	{ bottom: vars.space.large },
)

export const photoContainer = style({
	minWidth: 0,
	minHeight: 0,
	width: '100%',
	aspectRatio: '1 / 1',
	position: 'relative',
	scrollSnapAlign: 'start',
})

export const image = style({
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	position: 'absolute',
})
