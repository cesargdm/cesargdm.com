import { env } from 'cloudflare:workers'

import { cached, ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { readJson } from '@/lib/json'
import { logIntegrationFailure } from '@/lib/log'

/**
 * Used when Slack is unreachable or unconfigured. The footer renders a clock,
 * so there is no sensible "empty" state — a wrong-by-an-hour clock during DST
 * beats no clock at all.
 */
export const FALLBACK_TIME_ZONE = 'America/Mexico_City'

/**
 * Returns the time zone from my Slack profile. Slack follows the machine I am
 * actually working on, which makes it a better source than a hardcoded zone.
 */
export async function getTimeZone(): Promise<string> {
	if (!env.SLACK_TOKEN || !env.SLACK_USER_ID) {
		logIntegrationFailure('slack', 'SLACK_TOKEN or SLACK_USER_ID is not set')
		return FALLBACK_TIME_ZONE
	}

	try {
		const response = await fetch(
			`https://slack.com/api/users.info?user=${env.SLACK_USER_ID}`,
			{
				...cached(ONE_DAY_SECONDS),
				headers: { Authorization: `Bearer ${env.SLACK_TOKEN}` },
			},
		)

		const data = await readJson<{
			ok: boolean
			error?: string
			user?: { tz?: string }
		}>(response)

		// Slack answers 200 with `ok: false` on auth failure, so the HTTP status
		// alone is not enough to tell success from a revoked token.
		if (!data.ok) {
			throw new Error(data.error ?? 'Slack returned ok: false')
		}

		return data.user?.tz ?? FALLBACK_TIME_ZONE
	} catch (error) {
		logIntegrationFailure('slack', error)
		return FALLBACK_TIME_ZONE
	}
}
