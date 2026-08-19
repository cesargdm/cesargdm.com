/**
 * Integrations degrade to empty UI rather than erroring the page, so a silent
 * failure is indistinguishable from "no data". Every degradation must be
 * logged here or breakage stays invisible in production.
 */
export function logIntegrationFailure(integration: string, error: unknown) {
	const reason = error instanceof Error ? error.message : String(error)

	// eslint-disable-next-line no-console
	console.warn(`[integration:${integration}] unavailable — ${reason}`)
}
