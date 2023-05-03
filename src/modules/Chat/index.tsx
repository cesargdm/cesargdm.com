'use client'

import TextInput from '@/components/TextInput'
import { useState } from 'react'

function Chat() {
	const [messages, setMessages] = useState(
		[] as { id: number; message: string }[],
	)

	function handleSubmit(event: any) {
		event.preventDefault()

		setMessages([...messages, { id: 1, message: 'Hello' }])
	}

	return (
		<>
			<h2>Chat</h2>
			<div>
				<ul>
					{messages.map((message) => (
						<li key={message.id}>Message</li>
					))}
				</ul>
				<form onSubmit={handleSubmit}>
					<TextInput type="text" />
					<input type="submit" />
				</form>
			</div>
		</>
	)
}

export default Chat
