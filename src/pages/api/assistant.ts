import type { APIRoute } from 'astro'
import OpenAI from 'openai'

export const prerender = false

const { OPENAI_API_KEY } = process.env

const openai = OPENAI_API_KEY
	? new OpenAI({ apiKey: OPENAI_API_KEY })
	: undefined

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID as string

const CONTENT_MAX_LENGTH = 4096

function json(data: unknown, init?: ResponseInit) {
	return new Response(JSON.stringify(data), {
		...init,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...init?.headers,
		},
	})
}

export const GET: APIRoute = async ({ request }) => {
	try {
		if (!openai) {
			throw new Error('OpenAI API key not provided')
		}

		const threadId = new URL(request.url).searchParams.get('threadId')

		if (!threadId?.length) {
			return json({ error: 'Thread ID is required' }, { status: 400 })
		}

		const messages = await openai.beta.threads.messages.list(threadId)

		return json({
			messages: messages.data.sort((a, b) => a.created_at - b.created_at),
			threadId,
		})
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		return json({ error: 'An error occurred' }, { status: 500 })
	}
}

export const PATCH: APIRoute = async ({ request }) => {
	try {
		if (!openai) {
			throw new Error('OpenAI API key not provided')
		}

		if (!request.body) {
			return json({ error: 'Request body is required' }, { status: 400 })
		}

		let threadId
		const { content, threadId: existingThreadId } = (await request.json()) as {
			content: string
			threadId?: string
		}

		if (!content?.length) {
			return json({ error: 'Content is required' }, { status: 400 })
		}

		if (content.length > CONTENT_MAX_LENGTH) {
			return json(
				{ error: 'Content must be less than 4096 characters' },
				{ status: 400 },
			)
		}

		if (!existingThreadId?.length) {
			const thread = await openai.beta.threads.create()
			threadId = thread.id
		} else {
			threadId = existingThreadId
		}

		await openai.beta.threads.messages.create(threadId, {
			role: 'user',
			content,
		})

		let run = await openai.beta.threads.runs.create(threadId, {
			assistant_id: ASSISTANT_ID,
			stream: false,
		})

		if (!run) throw new Error('Run not created')

		while (run.status === 'queued' || run.status === 'in_progress') {
			run = await openai.beta.threads.runs.retrieve(run.id, {
				thread_id: threadId,
			})
		}

		const messages = await openai.beta.threads.messages.list(threadId)

		return json({
			threadId,
			messages: messages.data.sort((a, b) => a.created_at - b.created_at),
		})
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		return json({ error: 'An error occurred' }, { status: 500 })
	}
}
