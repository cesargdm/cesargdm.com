import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const chatMessage = style({
	maxWidth: '80%',
	justifySelf: 'start',
	borderRadius: vars.borderRadius.large,
	backgroundColor: vars.colors.background.gray,
	padding: `${vars.space.medium} ${vars.space.large}`,
})

export const chatContainer = style({
	flexGrow: 1,
	height: '20vh',
	display: 'flex',
	flexDirection: 'column',
})

export const chatMessageUser = style([
	chatMessage,
	{
		backgroundColor: vars.colors.primary,
		color: 'white',
		justifySelf: 'end',
	},
])

export const participantName = style({
	justifySelf: 'start',
	fontSize: '0.8rem',
	marginLeft: '8px',
	opacity: 0.7,
})

export const chatMessagesList = style({
	width: '100%',
	display: 'grid',
	marginTop: 'auto',
	maxHeight: '100%',
	alignItems: 'end',
	overflowY: 'auto',
	gap: vars.space.medium,
	padding: vars.space.small,
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
