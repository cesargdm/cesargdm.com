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

export const ONE_HOUR_SECONDS = 3600
export const ONE_DAY_SECONDS = 86400
