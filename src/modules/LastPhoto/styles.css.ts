import { style } from '@vanilla-extract/css'

export const square = style({
	width: '100%',
	':after': {
		content: '',
		display: 'block',
		paddingBottom: '100%',
	},
})
