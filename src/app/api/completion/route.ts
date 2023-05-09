import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const MODEL = 'davinci:ft-personal-2023-04-07-20-32-03'

export const revalidate = 60 * 60 * 6

export async function GET(request: Request) {
	// get prompt from params
	const rawPrompt = new URL(request.url).searchParams.get('prompt') ?? ''
	const prompt = `${rawPrompt.trim().replace('->', '').slice(0, 50)}->`

	if (!prompt) {
		return new Response('Missing prompt', {
			status: 400,
		})
	}

	try {
		const { data } = await openai.createCompletion({
			prompt: prompt,
			model: MODEL,
			stop: ['END'],
			max_tokens: 50,
			temperature: 0.8,
		})

		const completion = data.choices[0].text

		// Save prompt to database
		await sql`
			INSERT INTO prompts (prompt, choice) VALUES (${prompt}, ${completion ?? ''})
		`.catch(() => undefined)

		return NextResponse.json(data)
	} catch (error) {
		console.error(error)

		return new Response('Server error', {
			status: 500,
		})
	}
}
