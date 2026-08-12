import training from '@/lib/assistant-training.json'

/**
 * Cloudflare Workers AI model used for the chat assistant.
 * See `wrangler ai models` for the full catalog.
 */
export const AI_MODEL = '@cf/meta/llama-3.1-8b-instruct'

export type ChatMessage = {
	role: 'user' | 'assistant'
	content: string
}

type TrainingPair = { prompt: string; completion: string }

let cachedSystemPrompt: string | undefined

/**
 * Builds the system prompt that gives the model César's persona. The former
 * OpenAI Assistant was configured out-of-band with this Q&A set; here we embed
 * it directly so Workers AI can answer in the same voice.
 */
export function buildSystemPrompt(): string {
	if (cachedSystemPrompt) return cachedSystemPrompt

	const knowledge = (training as TrainingPair[])
		.filter((pair) => pair.prompt && pair.completion)
		.map((pair) => `Q: ${pair.prompt}\nA: ${pair.completion}`)
		.join('\n\n')

	cachedSystemPrompt = [
		"You are César Guadarrama's friendly personal assistant on his website (cesargdm.com).",
		'César is a product engineer from Mexico who works with TypeScript, React, Node, GraphQL and more.',
		'Answer as César in the first person, in a warm, concise and casual tone. Keep replies short (1-3 sentences).',
		"Base your answers on the reference Q&A below. If something is not covered, answer briefly in César's voice or say you are not sure.",
		'Do not invent contact details or sensitive information.',
		'',
		'Reference Q&A about César:',
		knowledge,
	].join('\n')

	return cachedSystemPrompt
}
