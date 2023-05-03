import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const textInput = style({
	backgroundColor: vars.colors.background.regular,
	border: `1px solid ${vars.colors.border}`,
	fontSize: vars.fontSize.medium,
	color: vars.colors.text.regular,
	padding: vars.space.large,
	paddingTop: vars.space.small,
	paddingBottom: vars.space.small,
	borderRadius: vars.borderRadius.large,
	display: 'block',
	width: '100%',
})
