import {
	createTheme,
	createGlobalTheme,
	createThemeContract,
	style,
	assignVars,
} from '@vanilla-extract/css'

export const root = createGlobalTheme(':root', {
	font: {
		heading: 'Georgia, Times, Times New Roman, serif',
		body: 'system-ui',
	},
	space: {
		small: '4px',
		medium: '8px',
		large: '16px',
		xlarge: '24px',
	},
	fontSize: {
		small: '0.75rem',
		medium: '1rem',
		large: '1.25rem',
		xlarge: '1.5rem',
	},
	borderRadius: {
		medium: '8px',
		large: '16px',
	},
	sizes: {
		navBar: '60px',
	},
})

const colors = createThemeContract({
	brand: null,
	background: {
		regular: null,
		content: null,
	},
	border: null,
	text: {
		regular: null,
		secondary: null,
		tertiary: null,
		decorative: null,
	},
})

export const responsiveTheme = style({
	vars: assignVars(colors, {
		brand: 'green',
		background: {
			regular: '#fff',
			content: '#f5f5f5',
		},
		border: '#ccc',
		text: {
			regular: '#000',
			secondary: '#666',
			tertiary: '#999',
			decorative: '#aaa',
		},
	}),
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: assignVars(colors, {
				brand: 'blue',
				background: {
					regular: '#000',
					content: '#111',
				},
				border: '#ccc',
				text: {
					regular: '#fff',
					secondary: '#ccc',
					tertiary: '#999',
					decorative: '#aaa',
				},
			}),
		},
	},
})

export const lightTheme = createTheme(colors, {
	brand: 'red',
	background: {
		regular: '#fff',
		content: '#f5f5f5',
	},
	border: '#ccc',
	text: {
		regular: '#000',
		secondary: '#666',
		tertiary: '#999',
		decorative: '#aaa',
	},
})

export const darkTheme = createTheme(colors, {
	brand: 'orange',
	background: {
		regular: '#000',
		content: '#111',
	},
	border: '#ccc',
	text: {
		regular: '#fff',
		secondary: '#ccc',
		tertiary: '#999',
		decorative: '#aaa',
	},
})

export const vars = { ...root, colors }
