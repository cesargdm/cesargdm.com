/**
 * Site-wide Content-Security-Policy. Applied in `src/middleware.ts` (on-demand
 * routes) and mirrored in `public/_headers` (prerendered pages and static
 * assets). Run `bun scripts/sync-public-headers.mjs` after edits; drift fails
 * `content-security-policy.test.ts`.
 *
 * `script-src` includes `'unsafe-inline'` because Astro emits inline bootstraps
 * for `client:*` islands and the theme FOUC script, and ClientRouter is not
 * compatible with Astro's built-in CSP hash mode. `style-src` needs
 * `'unsafe-inline'` for the inlined glass refraction CSS and component styles.
 */
export const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://giscus.app https://mozilla.github.io https://static.cloudflareinsights.com",
	"style-src 'self' 'unsafe-inline' https://giscus.app",
	"font-src 'self'",
	[
		"img-src 'self' data: blob:",
		'https://images.unsplash.com',
		'https://i.gr-assets.com',
		'https://s.gr-assets.com',
		'https://*.seadn.io',
		'https://ipfs.io',
		'https://gateway.pinata.cloud',
		'https://cloudflare-ipfs.com',
		'https://*.mypinata.cloud',
		'https://arweave.net',
		'https://*.arweave.net',
		'https://alchileverso.s3.amazonaws.com',
		'https://metadata.ens.domains',
		'https://hoynocircula.cesargdm.com',
		'https://www.tolo.cafe',
		'https://tolo.cafe',
		'https://theyxolo.art',
		'https://cretia.app',
		'https://www.cretia.app',
		'https://user-images.githubusercontent.com',
	].join(' '),
	"connect-src 'self' https://giscus.app https://api.github.com https://cloudflareinsights.com",
	"worker-src 'self' blob:",
	'frame-src https://giscus.app https://github.com',
	"manifest-src 'self'",
].join('; ')
