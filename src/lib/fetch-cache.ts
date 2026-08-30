/**
 * Cloudflare's edge cache replaces Next's `next: { revalidate }` fetch option,
 * which does nothing outside Next. `cacheEverything` is required because these
 * are JSON/XML responses, which Cloudflare does not cache by default.
 */
export function cached(seconds: number): RequestInit {
	return {
		cf: { cacheEverything: true, cacheTtl: seconds },
	}
}

export const ONE_MINUTE_SECONDS = 60
export const ONE_HOUR_SECONDS = 3600
export const ONE_DAY_SECONDS = 86400

/**
 * Cache-Control for Worker-generated GET responses.
 *
 * `stale-while-revalidate` without a duration is ignored. `s-maxage` is what
 * Workers Cache honors; `max-age` is for browsers. Defaulting the browser TTL
 * to 0 keeps crawlers and tabs revalidating while the edge can still HIT.
 */
export function cacheControl(edgeSeconds: number, browserSeconds = 0): string {
	return `public, max-age=${browserSeconds}, s-maxage=${edgeSeconds}, stale-while-revalidate=${edgeSeconds}`
}
