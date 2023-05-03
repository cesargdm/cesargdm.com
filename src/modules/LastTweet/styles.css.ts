import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const readTweetsLink = style({
	minHeight: vars.sizes.button,
	backgroundColor: '#1da1f2',
	color: 'white',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: `calc(${vars.borderRadius.large} + ${vars.space.large})`,
})

export const tweetParagraph = style({
	fontSize: vars.fontSize.xlarge,
	padding: `${vars.space.large} 0`,
})
