'use client'
import { useEffect, useRef, useState } from 'react'
import { IconArrowUp, IconDots, IconMessage } from '@tabler/icons-react'

import { vars } from '@/app/theme.css'
import TextInput from '@/components/TextInput'

import {
	chatForm,
	chatMessage,
	submitButton,
	chatContainer,
	chatMessageUser,
	chatMessagesList,
} from './styles.css'

function Chat() {
	const [prompt, setPrompt] = useState('')
	const [messages, setMessages] = useState([
		{ id: '0', text: 'Hey! got any questions?', from: 'assistant' },
	])
	const [isLoading, setIsLoading] = useState(false)

	const chatListRef = useRef<HTMLUListElement>(null)

	useEffect(() => {
		async function fetchResponse() {
			setIsLoading(false)

			const userMessage = messages[messages.length - 1].text

			setMessages((prev) => [
				...prev,
				{ id: 'LOADING', text: '', from: 'assistant' },
			])

			const data = await fetch(
				`https://cesargdm.com/api/completion?prompt=${userMessage}`,
			)
				.then((response) => response.json())
				.catch(() => null)
			const text = data?.choices[0].text

			setMessages((prev) => [
				...prev.filter((message) => message.id !== 'LOADING'),
				{ id: String(Date.now()), text, from: 'assistant' },
			])
		}

		chatListRef.current?.scrollTo({
			top: chatListRef.current.scrollHeight,
			behavior: 'smooth',
		})

		const lastMessage = messages[messages.length - 1]

		if (lastMessage.from === 'user') {
			setIsLoading(true)
			fetchResponse()
		}
	}, [messages])

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		setPrompt('')
		setMessages((prev) => [
			...prev,
			{ id: String(Date.now()), text: prompt, from: 'user' },
		])
	}

	return (
		<>
			<h2>
				<IconMessage aria-hidden />
				Chat
			</h2>
			<div className={chatContainer}>
				<ul ref={chatListRef} className={chatMessagesList}>
					{messages.map((message) => (
						<li
							className={
								message.from === 'assistant' ? chatMessage : chatMessageUser
							}
							key={message.id}
						>
							{message.id === 'LOADING' ? (
								<IconDots key="dots" color={vars.colors.text.decorative} />
							) : (
								message.text
							)}
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
						disabled={isLoading || !prompt}
						aria-label="Send message"
						className={submitButton}
					>
						<IconArrowUp strokeWidth={3} aria-hidden />
					</button>
				</form>
			</div>
		</>
	)
}

export default Chat
