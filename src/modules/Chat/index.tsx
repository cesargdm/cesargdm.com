import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	IconArrowUp,
	IconArrowUpRight,
	IconDots,
	IconMessage,
} from '@tabler/icons-react'
import type { ChangeEvent, FormEvent } from 'react'

import TextInput from '@/components/TextInput'

import type { Locale } from '@/lib/i18n'
import { readJson } from '@/lib/json'

import { vars } from '@/styles/theme.css'

import {
	chatContainer,
	chatForm,
	chatMessage,
	chatMessagesList,
	chatMessageUser,
	headingLink,
	submitButton,
} from './styles.css'

type Message = {
	id: string
	role: 'user' | 'assistant'
	text: string
	loading?: boolean
}

const GREETING: Message = {
	id: 'greeting',
	role: 'assistant',
	text: "Hey! what's up?",
}

const LOADING_ID = 'LOADING'

function Chat({ locale }: { locale: Locale }) {
	const [messages, setMessages] = useState<Message[]>([GREETING])
	const [content, setContent] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const chatListRef = useRef<HTMLUListElement>(null)

	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setContent(event.target.value)
	}, [])

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			const text = content.trim()
			if (!text || isLoading) return

			const userMessage: Message = {
				id: String(Date.now()),
				role: 'user',
				text,
			}

			const apiMessages = [...messages, userMessage]
				.filter((message) => !message.loading && message.id !== 'greeting')
				.map((message) => ({ role: message.role, content: message.text }))

			setMessages((prev) => [
				...prev,
				userMessage,
				{ id: LOADING_ID, role: 'assistant', text: '', loading: true },
			])
			setContent('')
			setIsLoading(true)

			try {
				const response = await fetch('/api/assistant', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ messages: apiMessages, locale }),
				})

				const data = await readJson<{ reply?: string; error?: string }>(
					response,
				)

				const reply = data.reply || "Sorry, I couldn't respond right now."

				setMessages((prev) =>
					prev
						.filter((message) => message.id !== LOADING_ID)
						.concat({
							id: `assistant-${Date.now()}`,
							role: 'assistant',
							text: reply,
						}),
				)
			} catch {
				setMessages((prev) =>
					prev
						.filter((message) => message.id !== LOADING_ID)
						.concat({
							id: `assistant-${Date.now()}`,
							role: 'assistant',
							text: 'Sorry, something went wrong. Please try again.',
						}),
				)
			} finally {
				setIsLoading(false)
			}
		},
		[content, isLoading, messages],
	)

	useEffect(() => {
		chatListRef.current?.scrollTo({
			top: chatListRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [messages])

	const renderedMessages = useMemo(
		() =>
			messages.map((message) => (
				<li
					key={message.id}
					className={
						message.role === 'assistant' ? chatMessage : chatMessageUser
					}
				>
					{message.loading ? (
						<IconDots color={vars.colors.text.decorative} />
					) : (
						<p>{message.text}</p>
					)}
				</li>
			)),
		[messages],
	)

	return (
		<>
			<a className={headingLink} href={`/${locale}/chat`}>
				<h2>
					<IconMessage aria-hidden />
					AI Chat
				</h2>
				<IconArrowUpRight />
			</a>
			<div className={chatContainer}>
				<ul ref={chatListRef} className={chatMessagesList}>
					{renderedMessages}
				</ul>
				<form className={chatForm} onSubmit={handleSubmit}>
					<TextInput
						value={content}
						onChange={handleChange}
						name="content"
						placeholder={isLoading ? 'Loading...' : 'Message...'}
						type="text"
					/>
					<button
						type="submit"
						disabled={isLoading || !content}
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
