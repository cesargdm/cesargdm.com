import { cached, ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { logIntegrationFailure } from '@/lib/log'

/**
 * Both accounts are the same person — `ocho-cesar` is the work profile — so the
 * calendar shows their union rather than half the picture.
 */
const GITHUB_USERNAMES = ['cesargdm', 'ocho-cesar']
export const YEARS_SHOWN = 3
const DATE_LENGTH = 10
const MAX_CONTRIBUTION_LEVEL = 4
// The boundaries between levels: three cut points for four non-zero buckets,
// derived from the level count so the two stay in step.
const QUARTILES = Array.from(
	{ length: MAX_CONTRIBUTION_LEVEL - 1 },
	(unused, index) => (index + 1) / MAX_CONTRIBUTION_LEVEL,
)

// A literal 0|1|2|3|4 union trips no-magic-numbers on the "3"/"4" members;
// the value is clamped to that range in toLevel() below regardless.
export type ContributionLevel = number

export type ContributionDay = {
	date: string
	count: number
	level: ContributionLevel
}

export type Contributions = {
	total: number
	days: ContributionDay[]
}

function parseTotal(html: string): number {
	const section =
		/id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/.exec(
			html,
		)?.[1]
	const total = section ? /([\d,]+)/.exec(section)?.[1] : undefined

	return total ? Number(total.replace(/,/g, '')) : 0
}

/**
 * High-activity days are capped in the tooltip text ("100+ contributions"),
 * so per-day counts here are best-effort — the header total (parseTotal) is
 * the accurate figure. The heatmap coloring uses `data-level`, not `count`.
 */
function parseTooltipCounts(html: string): Map<string, number> {
	const counts = new Map<string, number>()

	for (const [, id, text] of html.matchAll(
		/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
	)) {
		const match = /^([\d,]+|No)\+? contributions?/.exec(text.trim())

		if (!match) continue

		counts.set(id, match[1] === 'No' ? 0 : Number(match[1].replace(/,/g, '')))
	}

	return counts
}

function toLevel(value: number): ContributionLevel {
	return Math.min(Math.max(value, 0), MAX_CONTRIBUTION_LEVEL)
}

function parseDays(
	html: string,
	counts: Map<string, number>,
): ContributionDay[] {
	const days: ContributionDay[] = []

	for (const [cell] of html.matchAll(
		/<td[^>]*class="ContributionCalendar-day"[^>]*>/g,
	)) {
		const date = /data-date="([^"]+)"/.exec(cell)?.[1]
		const level = /data-level="(\d)"/.exec(cell)?.[1]
		const id = /id="([^"]+)"/.exec(cell)?.[1]

		if (!date || level === undefined) continue

		days.push({
			date,
			count: id ? (counts.get(id) ?? 0) : 0,
			level: toLevel(Number(level)),
		})
	}

	return days
}

/**
 * GitHub's REST API doesn't expose the contribution calendar, and the
 * GraphQL `contributionsCollection` field needs an auth token — which would
 * mean shipping a secret for a build-time-only, read-only, public dataset.
 * This profile fragment (what the profile page fetches to render the graph)
 * needs no auth and returns the same per-day data as HTML, so it's parsed by
 * hand here instead — see goodreads.ts for why an HTML parser isn't shipped
 * to the edge runtime for this.
 */
async function getProfileContributions(
	username: string,
	year: number,
): Promise<Contributions | undefined> {
	try {
		// `to` is accepted and then ignored — the fragment always returns the whole
		// calendar year — so the current year's unreached days are dropped during
		// the merge instead, not here.
		const response = await fetch(
			`https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`,
			{
				...cached(ONE_DAY_SECONDS),
				headers: { 'user-agent': 'cesargdm.com (+https://cesargdm.com)' },
			},
		)

		if (!response.ok) {
			throw new Error(`GitHub contributions responded ${response.status}`)
		}

		const html = await response.text()
		const days = parseDays(html, parseTooltipCounts(html))

		if (!days.length) {
			throw new Error('No contribution days parsed from response')
		}

		return { total: parseTotal(html), days }
	} catch (error) {
		logIntegrationFailure(`github:${username}:${year}`, error)
		return undefined
	}
}

/**
 * `data-level` is a bucket within a single account's own distribution, so the
 * levels of two accounts cannot be added — a quiet day on a busy profile and a
 * busy day on a quiet one both read as level 2. Levels are recomputed from the
 * summed counts, bucketed by quartile of the non-zero days, which is how
 * GitHub derives them in the first place.
 */
function toQuartileLevels(counts: Map<string, number>): ContributionDay[] {
	const active = [...counts.values()]
		.filter((count) => count > 0)
		.sort((a, b) => a - b)

	const thresholds = QUARTILES.map(
		(quartile) => active[Math.floor(active.length * quartile)] ?? 1,
	)

	return [...counts.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([date, count]) => ({
			date,
			count,
			level:
				count > 0
					? toLevel(thresholds.filter((t) => count >= t).length + 1)
					: 0,
		}))
}

export async function getContributions(): Promise<Contributions | undefined> {
	const currentYear = new Date().getUTCFullYear()
	const years = Array.from(
		{ length: YEARS_SHOWN },
		(unused, index) => currentYear - index,
	)

	// The header total on a ranged request describes that range, so the yearly
	// responses sum to a real three-year total rather than double-counting.
	const today = new Date().toISOString().slice(0, DATE_LENGTH)

	const requests = years.flatMap((year) =>
		GITHUB_USERNAMES.map((username) => getProfileContributions(username, year)),
	)

	const profiles = (await Promise.all(requests)).filter(
		(profile): profile is Contributions => Boolean(profile),
	)

	// One profile failing should still leave a calendar rather than an empty card.
	if (!profiles.length) return undefined

	const counts = new Map<string, number>()
	const levels = new Map<string, number>()

	for (const profile of profiles) {
		for (const day of profile.days) {
			// Days that have not happened yet would render as four months of blank
			// columns in front of the most recent work.
			if (day.date > today) continue

			counts.set(day.date, (counts.get(day.date) ?? 0) + day.count)
			levels.set(day.date, Math.max(levels.get(day.date) ?? 0, day.level))
		}
	}

	const total = profiles.reduce((sum, profile) => sum + profile.total, 0)

	// Per-day counts come from tooltip text, which GitHub caps ("100+") and may
	// restructure. If none survived parsing, the source levels are still right
	// for the busier profile — better a slightly wrong shade than a blank grid.
	const hasCounts = [...counts.values()].some((count) => count > 0)

	if (!hasCounts) {
		return {
			total,
			days: [...levels.entries()]
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([date, level]) => ({ date, count: 0, level })),
		}
	}

	return { total, days: toQuartileLevels(counts) }
}
