const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = 'davinci:ft-personal-2023-04-07-20-32-03'

module.exports = async function (request, response) {
	const { prompt: rawPrompt = "What's your name?" } = request.query

	try {
		const openai = new OpenAIApi(configuration)

		const result = await openai.createCompletion({
			prompt: `${rawPrompt.slice(0, 50)}->`,
			model: MODEL,
			max_tokens: 50,
			temperature: 0.5,
			stop: ['END'],
		})

		response.setHeader('Cache-Control', 's-maxage=86400')

		return response.json(result.data.choices[0])
	} catch (error) {
		console.error(error)

		return response.status(500).json({ error: 'Something went wrong' })
	}
}
