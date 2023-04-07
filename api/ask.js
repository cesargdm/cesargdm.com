const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = 'text-davinci-003'

module.exports = async function (request, response) {
	const { prompt = "What's your name?" } = request.query

	const openai = new OpenAIApi(configuration)

	const result = await openai.createCompletion({
		model: MODEL,
		prompt,
		max_tokens: 7,
		temperature: 0,
	})

	response.setHeader('Cache-Control', 's-maxage=86400')
	return response.send(result.data.choices[0].text)
}
