'use client'

import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	IconArrowUp,
	IconArrowUpRight,
	IconDots,
	IconMessage,
} from '@tabler/icons-react'
import Link from 'next/link'
import type { ChangeEvent, FormEvent } from 'react'

import TextInput from '@/components/TextInput'

import { BASE_URL } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'

import { vars } from '@/app/theme.css'

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
	content?: {
		type: 'text' | 'loading'
		text?: { value: string }
	}[]
	role: 'user' | 'assistant'
}

type State = {
	content: string
	threadId: string
	isLoading: boolean
	messages: Message[]
}

type AssistantResponseData = { threadId: string; messages: Message[] }

function getInitialState(): State {
	const threadId =
		(typeof window === 'object' && window.localStorage.getItem('threadId')) ||
		''

	return {
		content: '',
		threadId,
		isLoading: true,
		messages: [],
	}
}

function Chat({ locale }: { locale: Locale }) {
	const [state, setState] = useState<State>(getInitialState)

	const chatListRef = useRef<HTMLUListElement>(null)

	useEffect(() => {
		async function loadMessages() {
			let data: Partial<State> | null = null

			if (state.threadId) {
				data = await fetch(
					`${BASE_URL}/api/assistant?threadId=${state.threadId}`,
				)
					.then((response) => response.json() as Promise<AssistantResponseData>)
					.catch(() => null)
			}

			if (!data) {
				data = {
					messages: [
						{
							id: '0',
							content: [{ type: 'text', text: { value: "Hey! what's up?" } }],
							role: 'assistant',
						},
					],
				}
			}

			setState((prev) => ({ ...prev, ...data, isLoading: false }))
		}

		loadMessages().catch(() => undefined)
	}, [])

	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setState((prev) => ({ ...prev, content: event.target.value }))
	}, [])

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			if (
				!('content' in event.target) ||
				typeof event.target.content !== 'object' ||
				!event.target.content ||
				!('value' in event.target.content)
			)
				return

			const content = event.target['content'].value as string

			if (!content) return

			setState((prev) => ({
				...prev,
				content: '',
				isLoading: true,
				messages: [
					...prev.messages,
					{
						id: String(Date.now()),
						content: [{ type: 'text', text: { value: content } }],
						role: 'user',
					},
					{ id: 'LOADING', content: [{ type: 'loading' }], role: 'assistant' },
				],
			}))

			const data = await fetch(`/api/assistant`, {
				method: 'PATCH',
				body: JSON.stringify({
					content: content,
					threadId: state.threadId,
				}),
			}).then((response) => response.json() as Promise<AssistantResponseData>)

			if (!state.threadId) {
				localStorage.setItem('threadId', data.threadId)
			}

			setState((prev) => ({ ...prev, ...data, isLoading: false }))
		},
		[state],
	)

	useEffect(() => {
		chatListRef.current?.scrollTo({
			top: chatListRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [state.messages])

	const messages = useMemo(
		() =>
			state.messages.map((message) => (
				<Fragment key={message.id}>
					<li
						className={
							message.role === 'assistant' ? chatMessage : chatMessageUser
						}
					>
						{message.content?.map((c, index) =>
							c.type === 'loading' ? (
								<IconDots key={index} color={vars.colors.text.decorative} />
							) : (
								<p key={index}>{c.text?.value}</p>
							),
						)}
					</li>
				</Fragment>
			)),
		[state.messages],
	)

	return (
		<>
			<Link className={headingLink} href={`/${locale}/chat`}>
				<h2>
					<IconMessage aria-hidden />
					AI Chat
				</h2>
				<IconArrowUpRight />
			</Link>
			<div className={chatContainer}>
				<ul ref={chatListRef} className={chatMessagesList}>
					{messages}
				</ul>
				<form className={chatForm} onSubmit={handleSubmit}>
					<TextInput
						value={state.content}
						onChange={handleChange}
						name="content"
						placeholder={state.isLoading ? 'Loading...' : 'Message...'}
						type="text"
					/>
					<button
						type="submit"
						disabled={state.isLoading || !prompt || !state.content}
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
