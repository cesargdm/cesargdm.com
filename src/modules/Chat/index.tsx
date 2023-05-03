'use client'
import { useEffect, useState } from 'react'

import TextInput from '@/components/TextInput'

import {
	chatForm,
	chatMessage,
	submitButton,
	chatMessagesContainer,
	chatMessageUser,
} from './styles.css'
import { IconArrowUp, IconMessage } from '@tabler/icons-react'

function Chat() {
	const [prompt, setPrompt] = useState('')
	const [messages, setMessages] = useState([
		{ id: '0', text: "Hey what's? up", from: 'assistant' },
	])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		async function fetchResponse() {
			setIsLoading(false)

			const userMessage = messages[messages.length - 1].text

			setMessages((prev) => [
				...prev,
				{ id: 'LOADING', text: '', from: 'assistant' },
			])

			const data = await fetch('/api/completion', {
				method: 'POST',
				body: JSON.stringify({ prompt: userMessage }),
			}).then((response) => response.json())

			setMessages((prev) => [
				...prev.filter((message) => message.id !== 'LOADING'),
				{ id: String(Date.now()), text: data.text, from: 'assistant' },
			])
		}

		const lastMessage = messages[messages.length - 1]

		if (lastMessage.from === 'user') {
			setIsLoading(true)
			fetchResponse()
		}
	}, [messages])

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		setPrompt('')
		setMessages((prev) => [...prev, { id: '1', text: prompt, from: 'user' }])
	}

	return (
		<>
			<h2>
				<IconMessage aria-hidden />
				Chat
			</h2>
			<div>
				<ul className={chatMessagesContainer}>
					{messages.map((message) => (
						<li
							className={
								message.from === 'assistant' ? chatMessage : chatMessageUser
							}
							key={message.id}
						>
							{message.text}
						</li>
					))}
				</ul>
				<form className={chatForm} onSubmit={handleSubmit}>
					<TextInput
						value={prompt}
						onChange={(event) => setPrompt(event.currentTarget.value)}
						name="prompt"
						placeholder="Message"
						type="text"
					/>
					<button
						value=""
						type="submit"
						disabled={isLoading}
						aria-label="Send message"
						className={submitButton}
					>
						<IconArrowUp aria-hidden />
					</button>
				</form>
			</div>
		</>
	)
}

export default Chat
