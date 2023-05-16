import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const cardButton = style({
	display: 'flex',
	fontWeight: 'bold',
	alignItems: 'center',
	gap: vars.space.small,
	justifyContent: 'center',
	minHeight: vars.sizes.button,
	backgroundColor: 'rgba(0, 0, 0, 0.3)',
	boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.2)',
	borderRadius: `calc(${vars.borderRadius.large} + ${vars.space.large})`,
	transition: '300ms',
	':hover': {
		textDecoration: 'none',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.8)',
	},
})

export const readTweetsButton = style([
	cardButton,
	{
		color: 'white',
		boxShadow: 'none',
		backgroundColor: '#1da1f2',
		':hover': {
			boxShadow: 'none',
			backgroundColor: '#0d8ecf',
		},
	},
])

export const tweetParagraph = style({
	fontSize: vars.fontSize.xlarge,
	padding: `${vars.space.large} 0`,
	margin: 'auto',
	textAlign: 'center',
})
