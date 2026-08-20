import {
	assignVars,
	createGlobalTheme,
	createTheme,
	createThemeContract,
	style,
} from '@vanilla-extract/css'

export const root = createGlobalTheme(':root', {
	font: {
		heading: 'Sora, Inter Tight, Inter, system-ui, sans-serif',
		body: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
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
		xxlarge: '32px',
		xxxlarge: '48px',
	},
	fontSize: {
		xxsmall: '0.6rem',
		xsmall: '0.8rem',
		small: '0.92rem',
		medium: '1rem',
		large: '1.1rem',
		xlarge: '1.2rem',
		xxlarge: '1.5rem',
		xxxlarge: '2rem',
	},
	borderRadius: {
		medium: '8px',
		large: '16px',
		xlarge: '36px',
		full: '9999px',
	},
	sizes: {
		navBar: '64px',
		button: '40px',
		maxWidthPage: '1440px',
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
	primary: '#3B82F6',
	background: {
		regular: '#F5F7FA',
		content: '#FFFFFF',
		gray: '#E5EAF0',
	},
	border: '#D4DCE6',
	text: {
		regular: '#111318',
		secondary: '#374151',
		tertiary: '#6B7280',
		decorative: '#A5AFBD',
	},
} as const

const darkColors = {
	primary: '#3B82F6',
	background: {
		regular: '#0B0E14',
		content: '#111318',
		gray: '#1A202C',
	},
	border: '#2A3442',
	text: {
		regular: '#F5F7FA',
		secondary: '#CBD5E1',
		tertiary: '#94A3B8',
		decorative: '#64748B',
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
