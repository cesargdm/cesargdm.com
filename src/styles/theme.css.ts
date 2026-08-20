import {
	assignVars,
	createGlobalTheme,
	createTheme,
	createThemeContract,
	globalStyle,
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
	// Five steps, deliberately. The previous eight tokens plus six hardcoded
	// values gave ten distinct sizes, which is more scale than a site this size
	// can use consistently.
	fontSize: {
		xsmall: '0.75rem',
		small: '0.875rem',
		medium: '1rem',
		large: '1.25rem',
		xlarge: '2rem',
	},
	// Three weights. Inter ships a variable face, so these cost one file.
	fontWeight: {
		regular: '400',
		medium: '600',
		bold: '700',
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
	colorScheme: 'light dark',
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: assignVars(colors, darkColors),
		},
	},
})

export const lightTheme = createTheme(colors, lightColors)

export const darkTheme = createTheme(colors, darkColors)

/*
 * The theme is a class on <html>, so a forced theme and the OS preference can
 * disagree. Without this, a visitor who toggles dark on a light OS keeps
 * light-rendered native controls — the select popup, the option list and the
 * scrollbars all stay white against a dark page.
 */
globalStyle(`.${lightTheme}`, { colorScheme: 'light' })
globalStyle(`.${darkTheme}`, { colorScheme: 'dark' })

/*
 * Form controls the reset in the global stylesheet does not reach. `select`
 * deliberately keeps its native appearance so the disclosure arrow and the
 * popup follow colorScheme above; only the box is brought in line.
 */
globalStyle('select, textarea', {
	color: colors.text.regular,
	backgroundColor: colors.background.content,
	border: `1px solid ${colors.border}`,
	borderRadius: root.borderRadius.medium,
	padding: `0 ${root.space.medium}`,
	minHeight: root.sizes.button,
	font: 'inherit',
})

globalStyle('textarea', {
	padding: root.space.large,
	lineHeight: 1.5,
})

/* Honoured by Firefox and by Chromium on Windows and Linux. */
globalStyle('option', {
	color: colors.text.regular,
	backgroundColor: colors.background.content,
})

globalStyle('select:focus-visible, textarea:focus-visible', {
	outline: `2px solid ${colors.primary}`,
	outlineOffset: '1px',
})

export const vars = { ...root, colors }
