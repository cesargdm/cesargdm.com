export function getHumanReadableDate(date: string | Date) {
	if (typeof date === 'object') {
		return date.toLocaleDateString()
	}

	return date
}

/**
 * Frontmatter dates are written in several shapes across the content — `2017`,
 * `2025-09`, `2022-10-01T00:00:00.000` — and YAML parses some of them into
 * `Date` objects. Comparing those raw produces undefined ordering, so
 * everything is normalised to a timestamp before sorting.
 */
export function toTimestamp(value: unknown): number {
	if (value instanceof Date) {
		const timestamp = value.getTime()
		return Number.isNaN(timestamp) ? 0 : timestamp
	}

	if (typeof value === 'number') return new Date(`${value}`).getTime()

	if (typeof value !== 'string') return 0

	const trimmed = value.trim()

	// `2017` and `2025-09` are not parsed consistently across engines; pad them
	// to a full ISO date so they sort against complete timestamps.
	const padded = /^\d{4}$/.test(trimmed)
		? `${trimmed}-01-01`
		: /^\d{4}-\d{2}$/.test(trimmed)
			? `${trimmed}-01`
			: trimmed

	const timestamp = new Date(padded).getTime()

	return Number.isNaN(timestamp) ? 0 : timestamp
}

export function byDateDescending(
	a: { data: { date?: unknown } },
	b: { data: { date?: unknown } },
) {
	return toTimestamp(b.data.date) - toTimestamp(a.data.date)
}

/** ISO 8601 string for a frontmatter date, or `null` when it can't be parsed. */
export function toIsoDate(value: unknown): string | null {
	const timestamp = toTimestamp(value)

	return timestamp ? new Date(timestamp).toISOString() : null
}
