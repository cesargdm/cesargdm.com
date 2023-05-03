import { Configuration, OpenAIApi } from 'openai'
import { NextResponse } from 'next/server'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const MODEL = 'davinci:ft-personal-2023-04-07-20-32-03'

export const revalidate = 60 * 60 * 6

export async function POST(request: Request) {
	const { prompt: rawPrompt = "What's your name?" } = await request.json()
	const prompt = `${rawPrompt.trim().replace('->', '').slice(0, 50)}->`

	try {
		const result = await openai.createCompletion({
			prompt: prompt,
			model: MODEL,
			stop: ['END'],
			max_tokens: 50,
			temperature: 1.0,
		})

		return NextResponse.json(result.data)
	} catch (error) {
		console.error(error)

		return new Response('Server error', {
			status: 500,
		})
	}
}
