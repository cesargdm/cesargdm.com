import { style } from '@vanilla-extract/css'

import { glassTint } from '@/styles/glass-tint.css'
import { vars } from '@/styles/theme.css'

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
	// The composer is pinned over the bottom of this box rather than stacked
	// under it, so messages pass behind its glass instead of stopping above it.
	position: 'relative',
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
	fontSize: vars.fontSize.xsmall,
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
	// Room for the composer sitting on top, so the newest message comes to rest
	// clear of it rather than permanently half-hidden.
	paddingBottom: `calc(${vars.sizes.button} + ${vars.space.xlarge})`,
})

export const submitButton = style([
	// The literal is the primary token's value, which is the same in both
	// themes; a var() cannot be given an alpha channel here.
	glassTint('rgba(59, 130, 246, 0.85)', 'rgba(59, 130, 246, 0.95)'),
	{
		border: 'none',
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: vars.borderRadius.full,
		':disabled': {
			backgroundColor: 'rgba(148, 163, 184, 0.5)',
		},
	},
])

export const chatForm = style({
	position: 'absolute',
	left: 0,
	right: 0,
	bottom: 0,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.small,
})
