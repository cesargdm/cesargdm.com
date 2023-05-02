import { style } from '@vanilla-extract/css'

export const socialItem = style({
	display: 'flex',
	selectors: {
		'&:not(:last-child)': {
			width: '20px',
		},
	},
})
