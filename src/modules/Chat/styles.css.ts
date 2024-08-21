import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

export const headingLink = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	textDecoration: 'none',
})

export const chatMessage = style({
	maxWidth: '80%',
	justifySelf: 'start',
	borderRadius: vars.borderRadius.large,
	backgroundColor: vars.colors.background.gray,
	padding: `${vars.space.medium} ${vars.space.large}`,
	position: 'relative',
	':after': {
		content: '',
		position: 'absolute',
		width: 0,
		height: 0,
		left: 0,
		bottom: 0,
		borderStyle: 'solid',
		borderWidth: '15px 0 0 15px',
		borderColor: `transparent ${vars.colors.background.gray}`,
	},
})

export const chatContainer = style({
	flexGrow: 1,
	height: '20svh',
	display: 'flex',
	flexDirection: 'column',
	minHeight: 250,
})

export const chatMessageUser = style([
	chatMessage,
	{
		backgroundColor: vars.colors.primary,
		color: 'white',
		justifySelf: 'end',
		':after': {
			borderWidth: '0 0 15px 15px',
			borderColor: `${vars.colors.primary} transparent`,
			right: 0,
			left: 'auto',
		},
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
	':disabled': {
		backgroundColor: vars.colors.text.tertiary,
	},
})

export const chatForm = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.small,
})
