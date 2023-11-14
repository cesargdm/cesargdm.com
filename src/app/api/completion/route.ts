import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const OPENAI_API_KEY = process.env?.OPENAI_API_KEY

const openai = OPENAI_API_KEY
	? new OpenAI({ apiKey: OPENAI_API_KEY })
	: undefined

const MODEL_ID = 'davinci:ft-personal-2023-04-07-20-32-03'

// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 6

export async function GET(request: Request) {
	// get prompt from params
	const rawPrompt = new URL(request.url).searchParams.get('prompt') ?? ''
	// eslint-disable-next-line no-magic-numbers
	const prompt = `${rawPrompt.trim().replace('->', '').slice(0, 50)}->`

	if (!prompt) {
		return new Response('Missing prompt', { status: 400 })
	}

	const date = new Date().toISOString()

	try {
		if (!openai) throw new Error('OpenAI not initialized')

		const completionResponse = await openai.completions.create({
			prompt: prompt,
			model: MODEL_ID,
			stop: ['END'],
			max_tokens: 50,
			temperature: 0.8,
		})

		const { text: completion } = completionResponse.choices[0] ?? {}

		await sql`
			INSERT INTO prompts (prompt, completion, date) VALUES (${prompt}, ${completion}, ${date})
		`.catch(() => undefined)

		return NextResponse.json(completionResponse)
	} catch (error) {
		return new Response('Server error', { status: 500 })
	}
}
