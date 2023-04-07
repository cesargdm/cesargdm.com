import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = 'text-davinci-003'

export default async function handler(request, response) {
	const { prompt = "What's your name?" } = request.query

	const openai = new OpenAIApi(configuration)

	const result = await openai.createCompletion({
		model: MODEL,
		prompt,
		max_tokens: 7,
		temperature: 0,
	})

	return response.send(result.data.choices[0].text)
}
