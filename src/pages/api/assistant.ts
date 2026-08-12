import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'

import type { ChatMessage } from '@/lib/assistant'
import { AI_MODEL, buildSystemPrompt } from '@/lib/assistant'
import { readJson } from '@/lib/json'

export const prerender = false

const MAX_HISTORY = 20
const MAX_TOKENS = 512
const TEMPERATURE = 0.7

function json(data: unknown, init?: ResponseInit) {
	return new Response(JSON.stringify(data), {
		...init,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...init?.headers,
		},
	})
}

export const POST: APIRoute = async ({ request }) => {
	try {
		if (!env.AI) {
			return json({ error: 'AI binding is not available' }, { status: 500 })
		}

		const body = await readJson<{ messages?: ChatMessage[] }>(request)

		const history = (body.messages ?? [])
			.filter(
				(message) =>
					(message.role === 'user' || message.role === 'assistant') &&
					typeof message.content === 'string' &&
					message.content.trim().length > 0,
			)
			.slice(-MAX_HISTORY)

		if (!history.length) {
			return json({ error: 'messages are required' }, { status: 400 })
		}

		const result = await env.AI.run(AI_MODEL, {
			messages: [{ role: 'system', content: buildSystemPrompt() }, ...history],
			max_tokens: MAX_TOKENS,
			temperature: TEMPERATURE,
		})

		const response = (result as { response?: string }).response
		const reply = typeof response === 'string' ? response : ''

		return json({ reply })
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		return json({ error: 'An error occurred' }, { status: 500 })
	}
}
