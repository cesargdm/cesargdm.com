import { logIntegrationFailure } from '@/lib/log'

const ONE_DAY_SECONDS = 86400

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
	const token = process.env.SLACK_TOKEN
	const userId = process.env.SLACK_USER_ID

	if (!token || !userId) {
		logIntegrationFailure('slack', 'SLACK_TOKEN or SLACK_USER_ID is not set')
		return FALLBACK_TIME_ZONE
	}

	try {
		const response = await fetch(
			`https://slack.com/api/users.info?user=${userId}`,
			{
				headers: { Authorization: `Bearer ${token}` },
				next: { revalidate: ONE_DAY_SECONDS },
			},
		)

		const data = (await response.json()) as {
			ok: boolean
			error?: string
			user?: { tz?: string }
		}

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
