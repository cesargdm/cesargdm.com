/**
 * Frontmatter is parsed without a schema, so any field can be a string, a Date,
 * a number or an object. Coerce defensively rather than stringifying whatever
 * turns up — `String({})` silently yields "[object Object]".
 */
export function text(value: unknown, fallback = ''): string {
	return typeof value === 'string' ? value : fallback
}
