import { vars } from '@/app/theme.css'

import { cardButton } from '../LastPost/styles.css'
import {
	globalStyle,
	keyframes,
	style,
	styleVariants,
} from '@vanilla-extract/css'

export const infiniteSlideFirst = keyframes({
	'0%': { transform: 'translate3d(0, 0, 0)' },
	'100%': { transform: 'translate3d(-100%, 0, 0)' },
})

export const infiniteSlideSecond = keyframes({
	'0%': { transform: 'translate3d(100%, 0, 0)' },
	'100%': { transform: 'translate3d(0, 0, 0)' },
})

export const nftListWrapper = style({
	position: 'absolute',
	top: 0,
	left: 0,
	bottom: 0,
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	paddingBottom: 30,
})

export const nftsList = style({
	position: 'relative',
	height: '100%',
})

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

export const nftListWrapper2Base = style({
	position: 'relative',
	display: 'flex',
	height: '33.333333%',
	animationDuration: '20s',
	animationTimingFunction: 'linear',
	animationIterationCount: 'infinite',
	willChange: 'translate3d',
	gap: '2%',
	padding: '1%',
})

export const nftListWrapper2 = styleVariants({
	first: [nftListWrapper2Base, { animationName: infiniteSlideFirst }],
	second: [nftListWrapper2Base, { animationName: infiniteSlideSecond }],
})

export const nftImage = style({
	width: '100%',
	height: '100%',
	objectFit: 'cover',
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
