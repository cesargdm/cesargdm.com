import { vars } from '@/styles/theme.css'

import { globalStyle, style } from '@vanilla-extract/css'

/*
 * One layer, not a stack. The effect that reads as glass is a blurred and
 * saturated backdrop plus a lit top edge — the specular highlight is what
 * suggests thickness, and stacking more translucent layers only muddies the
 * text sitting on top.
 *
 * Saturation matters as much as blur: without it, a blurred backdrop washes out
 * to grey and the surface looks like frosted plastic.
 */
// Barely any blur: blur is what makes a surface read as frosted, and the
// bending is supposed to do the work here.
const BACKDROP = 'blur(1px) saturate(215%)'
const BACKDROP_HOVER = 'blur(2px) saturate(250%)'

/*
 * Refraction: what makes it read as glass rather than as frosting. The filter
 * lives in Layout.astro and displaces the backdrop along a smoothed noise field,
 * so straight edges passing behind bend the way they do through a real pane.
 *
 * It is applied as a second declaration on the same class rather than folded
 * into BACKDROP, because `url()` inside backdrop-filter is Chromium-only today.
 * A browser that cannot parse it drops this declaration and keeps the blur above
 * it; folding them together would lose the blur too.
 */
const REFRACTED = `${BACKDROP} url(#glass-refraction)`
const REFRACTED_HOVER = `${BACKDROP_HOVER} url(#glass-refraction)`

/*
 * Inset only. A drop shadow reads as an opaque object sitting above the page,
 * which is the opposite of what a pane you can see through should do — the
 * refracted edge already separates it from the backdrop.
 */
const BEVEL = [
	// The lit edge, where light catches the top of the pane.
	'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
	// A hairline rim so the shape stays legible against a busy backdrop.
	'inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
].join(', ')

export const glass = style({
	backgroundColor: vars.colors.background.glass,
	backdropFilter: BACKDROP,
	boxShadow: BEVEL,
	transition:
		'backdrop-filter 300ms, background-color 300ms, transform 260ms cubic-bezier(0.2, 0.8, 0.3, 1)',

	'@supports': {
		// Firefox shipped backdrop-filter late and it is still disabled in some
		// builds. Without a fallback the surface is merely semi-transparent, and
		// text on it sits directly on whatever scrolls underneath.
		'not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))':
			{
				backgroundColor: vars.colors.background.content,
			},
	},
})

/**
 * The card CTAs sit on top of photographs, where a light pane would leave white
 * text on whatever happens to be behind it. A dark tint is the same treatment
 * inverted, and it is what keeps the label readable over an arbitrary image.
 */
export const glassOverImage = style({
	backgroundColor: 'rgba(0, 0, 0, 0.22)',
	backdropFilter: BACKDROP,
	boxShadow: BEVEL,
	transition:
		'backdrop-filter 300ms, background-color 300ms, transform 260ms cubic-bezier(0.2, 0.8, 0.3, 1)',
	':hover': {
		backgroundColor: 'rgba(0, 0, 0, 0.42)',
		backdropFilter: BACKDROP_HOVER,
	},
	'@supports': {
		'not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))':
			{
				backgroundColor: 'rgba(0, 0, 0, 0.6)',
			},
	},
})

/**
 * Glass for a button that has to keep a brand colour. The tint stays high so
 * white text keeps effectively the same contrast it had when the button was
 * solid — below about 0.8 the label starts competing with whatever shows
 * through, which is exactly the trade a CTA should not make.
 */
export function glassTint(color: string, hoverColor: string) {
	return style({
		backgroundColor: color,
		backdropFilter: BACKDROP,
		boxShadow: BEVEL,
		transition:
			'backdrop-filter 300ms, background-color 300ms, transform 260ms cubic-bezier(0.2, 0.8, 0.3, 1)',
		':hover': {
			backgroundColor: hoverColor,
			backdropFilter: BACKDROP_HOVER,
		},
	})
}

/** Lifting the blur on hover reads as the pane catching more light. */
export const glassInteractive = style([
	glass,
	{
		':hover': {
			backdropFilter: BACKDROP_HOVER,
		},
	},
])

globalStyle(`.${glass}`, { backdropFilter: REFRACTED })
globalStyle(`.${glassOverImage}`, { backdropFilter: REFRACTED })
globalStyle(`.${glassInteractive}:hover`, { backdropFilter: REFRACTED_HOVER })
globalStyle(`.${glassOverImage}:hover`, { backdropFilter: REFRACTED_HOVER })
