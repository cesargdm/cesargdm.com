import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const chatMessage = style({
	padding: `${vars.space.medium} ${vars.space.large}`,
	backgroundColor: '#E9E9EB',
	borderRadius: vars.borderRadius.large,
	maxWidth: '80%',
})

export const chatMessageUser = style([
	chatMessage,
	{
		backgroundColor: vars.colors.primary,
		color: 'white',
		alignSelf: 'flex-end',
	},
])

export const chatMessagesContainer = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
	padding: vars.space.small,
	alignItems: 'flex-start',
	width: '100%',
	gap: vars.space.medium,
	height: '100vh',
	maxHeight: '20vh',
	overflowY: 'auto',
})

export const submitButton = style({
	border: 'none',
	color: 'white',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: vars.colors.primary,
	borderRadius: vars.borderRadius.full,
})

export const chatForm = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.small,
})
