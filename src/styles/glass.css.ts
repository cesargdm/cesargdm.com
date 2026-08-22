import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

/*
 * Every export here has to be serialisable. Layout.astro imports the refraction
 * CSS below, and importing a `.css.ts` from a runtime module makes
 * vanilla-extract serialise the whole module's exports — which a function
 * cannot survive. That is why `glassTint` lives in `glass-tint.css.ts` rather
 * than here.
 */

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
export const BACKDROP = 'blur(1px) saturate(215%)'
export const BACKDROP_HOVER = 'blur(2px) saturate(250%)'

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
export const BEVEL = [
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

/** Lifting the blur on hover reads as the pane catching more light. */
export const glassInteractive = style([
	glass,
	{
		':hover': {
			backdropFilter: BACKDROP_HOVER,
		},
	},
])

/*
 * A composed style's class name is several class names separated by spaces, so
 * interpolating one straight into a selector builds a descendant combinator and
 * matches nothing — `.a b:hover` rather than `.a.b:hover`. Chaining them is what
 * keeps a composed class addressable.
 */
function selector(className: string) {
	return `.${className.trim().split(/\s+/).join('.')}`
}

/**
 * The refraction, as plain CSS for `Layout.astro` to inline.
 *
 * It cannot be emitted from this file. Vanilla-extract's output is a virtual
 * module, and the production pipeline drops any `backdrop-filter` whose value
 * carries a `url()` when it arrives that way — through `globalStyle` and
 * through the fallback-array form on the style object alike. The identical
 * declaration in a real `.css` file survives untouched, so this is not the
 * minifier: `blur(3px) url(#probe)` added to `global.css` comes out the other
 * side complete, and autoprefixed.
 *
 * The failure was silent and asymmetric, which is what made it expensive. The
 * rules are in the dev-server CSS, so the effect looked right locally while
 * production had been shipping the SVG filter and nothing that referenced it.
 * `is:inline` is what Astro leaves alone.
 *
 * Ordering is load-bearing: these are single-class selectors, the same
 * specificity as the bundled rules they override, so only document order
 * separates them — Layout renders this in the body, after the head stylesheet.
 */
export const REFRACTION_CSS = [
	`${selector(glass)},${selector(glassOverImage)}{-webkit-backdrop-filter:${REFRACTED};backdrop-filter:${REFRACTED}}`,
	`${selector(glassInteractive)}:hover,${selector(glassOverImage)}:hover{-webkit-backdrop-filter:${REFRACTED_HOVER};backdrop-filter:${REFRACTED_HOVER}}`,
].join('')
