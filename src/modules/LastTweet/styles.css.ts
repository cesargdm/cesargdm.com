import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const readTweetsLink = style({
	minHeight: vars.sizes.button,
	backgroundColor: '#1da1f2',
	color: 'white',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: `calc(${vars.borderRadius.large} + ${vars.space.large})`,
	fontWeight: 'bold',
	display: 'flex',
	gap: vars.space.small,
	':hover': {
		textDecoration: 'none',
		backgroundColor: '#0d8ecf',
	},
})

export const tweetParagraph = style({
	fontSize: vars.fontSize.xlarge,
	padding: `${vars.space.large} 0`,
	margin: 'auto',
	textAlign: 'center',
})
