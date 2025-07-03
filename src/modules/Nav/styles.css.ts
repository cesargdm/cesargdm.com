import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

export const navContainer = style({
	left: 0,
	right: 0,
	zIndex: 100,
	display: 'grid',
	margin: '0 auto',
	position: 'fixed',
	justifyItems: 'center',
	gap: vars.space.medium,
	height: vars.sizes.navBar,
	maxWidth: vars.sizes.maxWidthPage,
	gridTemplateColumns: 'auto 3fr auto',
	padding: vars.space.medium,
	paddingRight: `max(${vars.space.large}, env(safe-area-inset-right))`,
	paddingLeft: `max(${vars.space.large}, env(safe-area-inset-left))`,
	paddingTop: `max(${vars.space.medium}, env(safe-area-inset-top))`,
	
	// Glass effect with backdrop blur and semi-transparent background
	background: 'rgba(255, 255, 255, 0.8)',
	backdropFilter: 'blur(20px) saturate(180%)',
	WebkitBackdropFilter: 'blur(20px) saturate(180%)',
	
	// Subtle border and shadow for glass appearance
	borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
	boxShadow: `
		0 8px 32px rgba(0, 0, 0, 0.05),
		0 1px 0 rgba(255, 255, 255, 0.5) inset,
		0 -1px 0 rgba(0, 0, 0, 0.05) inset
	`,
	
	// Light refraction effects
	'::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '1px',
		background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
		pointerEvents: 'none',
	},
	
	// Dark mode glass effect
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(0, 0, 0, 0.7)',
			borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
			boxShadow: `
				0 8px 32px rgba(0, 0, 0, 0.3),
				0 1px 0 rgba(255, 255, 255, 0.1) inset,
				0 -1px 0 rgba(0, 0, 0, 0.2) inset
			`,
		},
	},
})

export const floatingList = style({
	padding: vars.space.small,
	borderRadius: vars.borderRadius.full,
	position: 'relative',
	
	// Enhanced glass effect for floating elements
	background: 'rgba(255, 255, 255, 0.9)',
	backdropFilter: 'blur(16px) saturate(180%)',
	WebkitBackdropFilter: 'blur(16px) saturate(180%)',
	border: '1px solid rgba(255, 255, 255, 0.3)',
	boxShadow: `
		0 4px 16px rgba(0, 0, 0, 0.1),
		0 1px 0 rgba(255, 255, 255, 0.6) inset
	`,
	
	// Light refraction highlight
	'::before': {
		content: '""',
		position: 'absolute',
		top: '1px',
		left: '1px',
		right: '1px',
		height: '50%',
		background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent)',
		borderRadius: 'inherit',
		pointerEvents: 'none',
	},
	
	// Dark mode adjustments
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(0, 0, 0, 0.8)',
			border: '1px solid rgba(255, 255, 255, 0.15)',
			boxShadow: `
				0 4px 16px rgba(0, 0, 0, 0.4),
				0 1px 0 rgba(255, 255, 255, 0.1) inset
			`,
		},
	},
})

export const navList = style([
	floatingList,
	{
		display: 'grid',
		height: '100%',
		justifyContent: 'end',
		gridAutoFlow: 'column',
		justifySelf: 'end',
	},
])

export const searchList = style([
	floatingList,
	{
		paddingTop: vars.space.medium,
		paddingBottom: vars.space.medium,
		borderRadius: vars.borderRadius.xlarge,
		width: 'min(var(--radix-popover-content-available-height), 800px)',
		maxHeight: 'var(--radix-popover-content-available-height)',
		
		// Enhanced glass effect for search list
		background: 'rgba(255, 255, 255, 0.95)',
		backdropFilter: 'blur(24px) saturate(180%)',
		WebkitBackdropFilter: 'blur(24px) saturate(180%)',
		border: '1px solid rgba(255, 255, 255, 0.4)',
		boxShadow: `
			0 8px 32px rgba(0, 0, 0, 0.12),
			0 1px 0 rgba(255, 255, 255, 0.7) inset
		`,
		
		// Dark mode for search list
		'@media': {
			'(prefers-color-scheme: dark)': {
				background: 'rgba(0, 0, 0, 0.9)',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				boxShadow: `
					0 8px 32px rgba(0, 0, 0, 0.6),
					0 1px 0 rgba(255, 255, 255, 0.15) inset
				`,
			},
		},
	},
])

export const centerNavList = style([
	navList,
	{
		justifyContent: 'center',
		justifySelf: 'center',
		position: 'relative',
		overflowX: 'auto',
	},
])

export const navItem = style({
	fontWeight: 'bolder',
})

export const navLink = style({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: vars.borderRadius.full,
	padding: `0 ${vars.space.large}`,
	color: vars.colors.text.secondary,
	cursor: 'pointer',
	opacity: 1,
	transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
	position: 'relative',
	overflow: 'hidden',
	
	// Glass hover effect (simplified for vanilla-extract compatibility)
	':hover': {
		textDecoration: 'none',
		transform: 'translateY(-1px)',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
		background: 'rgba(255, 255, 255, 0.1)',
	},
	
	':focus': {
		outline: 'none',
		transform: 'translateY(-1px)',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
		background: 'rgba(255, 255, 255, 0.1)',
	},
	
	// Dark mode hover adjustments
	'@media': {
		'(prefers-color-scheme: dark)': {
			':hover': {
				background: 'rgba(255, 255, 255, 0.05)',
			},
			':focus': {
				background: 'rgba(255, 255, 255, 0.05)',
			},
		},
	},
})

export const navLinkActive = style({
	color: vars.colors.text.regular,
	position: 'relative',
	
	// Enhanced glass effect for active state
	background: 'rgba(255, 255, 255, 0.95)',
	backdropFilter: 'blur(12px)',
	WebkitBackdropFilter: 'blur(12px)',
	border: '1px solid rgba(255, 255, 255, 0.4)',
	boxShadow: `
		0 2px 8px rgba(0, 0, 0, 0.1),
		0 1px 0 rgba(255, 255, 255, 0.8) inset,
		0 -1px 0 rgba(0, 0, 0, 0.05) inset
	`,
	
	// Light refraction effect for active state
	'::after': {
		content: '""',
		position: 'absolute',
		top: '1px',
		left: '1px',
		right: '1px',
		height: '40%',
		background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent)',
		borderRadius: 'inherit',
		pointerEvents: 'none',
	},
	
	// Dark mode active state
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(0, 0, 0, 0.9)',
			border: '1px solid rgba(255, 255, 255, 0.2)',
			boxShadow: `
				0 2px 8px rgba(0, 0, 0, 0.3),
				0 1px 0 rgba(255, 255, 255, 0.1) inset
			`,
		},
	},
})

export const navToggleThemeItem = style({
	transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
	transform: 'scale(1)',
	display: 'none',
	padding: 0,
	position: 'relative',
	
	// Enhanced glass effect
	background: 'rgba(255, 255, 255, 0.9)',
	backdropFilter: 'blur(16px) saturate(180%)',
	WebkitBackdropFilter: 'blur(16px) saturate(180%)',
	border: '1px solid rgba(255, 255, 255, 0.3)',
	borderRadius: vars.borderRadius.full,
	boxShadow: `
		0 4px 16px rgba(0, 0, 0, 0.1),
		0 1px 0 rgba(255, 255, 255, 0.6) inset
	`,
	
	// Light refraction highlight
	'::before': {
		content: '""',
		position: 'absolute',
		top: '1px',
		left: '1px',
		right: '1px',
		height: '50%',
		background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent)',
		borderRadius: 'inherit',
		pointerEvents: 'none',
	},
	
	':hover': {
		transform: 'scale(0.95) translateY(-1px)',
		boxShadow: `
			0 6px 20px rgba(0, 0, 0, 0.15),
			0 1px 0 rgba(255, 255, 255, 0.8) inset
		`,
	},
	
	':focus': {
		transform: 'scale(0.95) translateY(-1px)',
		outline: 'none',
	},
	
	':active': {
		transform: 'scale(0.9)',
	},
	
	// Dark mode and responsive adjustments
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(0, 0, 0, 0.8)',
			border: '1px solid rgba(255, 255, 255, 0.15)',
			boxShadow: `
				0 4px 16px rgba(0, 0, 0, 0.4),
				0 1px 0 rgba(255, 255, 255, 0.1) inset
			`,
			
			':hover': {
				boxShadow: `
					0 6px 20px rgba(0, 0, 0, 0.6),
					0 1px 0 rgba(255, 255, 255, 0.15) inset
				`,
			},
		},
		
		'(min-width: 768px)': {
			display: 'inherit',
		},
	},
})
