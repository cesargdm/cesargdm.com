import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const textInput = style({
	width: '100%',
	display: 'block',
	padding: vars.space.large,
	paddingTop: vars.space.small,
	fontSize: vars.fontSize.medium,
	paddingBottom: vars.space.small,
	color: vars.colors.text.regular,
	borderRadius: vars.borderRadius.large,
	border: `1px solid ${vars.colors.border}`,
	backgroundColor: vars.colors.background.regular,
})
