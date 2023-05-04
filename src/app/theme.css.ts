import {
	style,
	assignVars,
	createTheme,
	createGlobalTheme,
	createThemeContract,
} from '@vanilla-extract/css'

export const root = createGlobalTheme(':root', {
	font: {
		heading: 'Georgia, Times, Times New Roman, serif',
		body: 'system-ui',
	},
	boxShadow: {
		medium: `0 3.9px 4.6px rgba(0, 0, 0, 0.04),
     0 12.3px 8.4px rgba(0, 0, 0, 0.056),
     0 18.8px 19.2px rgba(0, 0, 0, 0.037),
     0 22px 40px rgba(0, 0, 0, 0.019)`,
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
		large: '1.1rem',
		xlarge: '1.2rem',
		xxlarge: '1.5rem',
	},
	borderRadius: {
		medium: '8px',
		large: '16px',
		xlarge: '24px',
		full: '9999px',
	},
	sizes: {
		navBar: '64px',
		button: '40px',
	},
})

const colors = createThemeContract({
	primary: null,
	background: {
		regular: null,
		content: null,
		gray: null,
	},
	border: null,
	text: {
		regular: null,
		secondary: null,
		tertiary: null,
		decorative: null,
	},
})

const lightColors = {
	primary: 'rgb(0, 122, 255)',
	background: {
		regular: '#fff',
		content: '#f8f8f8',
		gray: '#eee',
	},
	border: '#ccc',
	text: {
		regular: '#000',
		secondary: '#444',
		tertiary: '#999',
		decorative: '#aaa',
	},
} as const

const darkColors = {
	primary: 'rgb(10, 132, 255)',
	background: {
		regular: '#000',
		content: '#111',
		gray: '#222',
	},
	border: '#333',
	text: {
		regular: '#fff',
		secondary: '#ccc',
		tertiary: '#999',
		decorative: '#aaa',
	},
} as const

export const responsiveTheme = style({
	vars: assignVars(colors, lightColors),
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: assignVars(colors, darkColors),
		},
	},
})

export const lightTheme = createTheme(colors, lightColors)

export const darkTheme = createTheme(colors, darkColors)

export const vars = { ...root, colors }
