import { createTheme } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
	color: {
		brand: 'blue',
		background: '#fff',
		content: '#f2f2f2',
	},
	space: {
		small: '4px',
		medium: '8px',
		large: '16px',
		xlarge: '24px',
	},
})
