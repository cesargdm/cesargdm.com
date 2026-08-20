import { style } from '@vanilla-extract/css'

/**
 * The press-in that native buttons get from the global stylesheet, for links
 * that act as buttons. Their class names are hashed, so a plain CSS selector
 * cannot reach them.
 *
 * Quick on the way down and a slower spring back: a physical control yields
 * under the finger and recovers more slowly, and matching that is what
 * separates this from a flat resize.
 */
export const press = style({
	transition: 'transform 260ms cubic-bezier(0.2, 0.8, 0.3, 1)',
	':active': {
		transform: 'scale(0.94)',
		transitionDuration: '90ms',
		transitionTimingFunction: 'ease-out',
	},
	'@media': {
		'(prefers-reduced-motion: reduce)': {
			transform: 'none',
			transition: 'none',
		},
	},
})
