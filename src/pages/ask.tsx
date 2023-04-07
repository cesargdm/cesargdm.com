import React, { useState } from 'react'
import styled from '@emotion/styled'
import { IconBolt, IconQuestionMark } from '@tabler/icons-react'

import Template from '../templates'
import useDebounce from '../utils/useDebounce'
import { useQuery } from '@tanstack/react-query'

const Input = styled.input`
	padding: var(--spaces--medium) var(--spaces--large);
	padding-left: calc(var(--spaces--large) + 12px);
	border-radius: var(--border_radius--small);
	border: 1px solid var(--colors--border);
	font-size: 1rem;
	font-weight: 700;
	display: block;
	width: 100%;
	color: var(--colors--tint);
`

const InputWrapper = styled.div`
	position: relative;
	margin: 0 auto;
	display: block;
	max-width: 300px;
`

function Ask() {
	const [prompt, setPrompt] = useState('')
	const debouncedPrompt = useDebounce(prompt, 1000)

	const { data, isInitialLoading } = useQuery({
		queryKey: ['ask', debouncedPrompt],
		queryFn: () =>
			fetch(`/api/ask?prompt=${debouncedPrompt}`, {
				method: 'GET',
			}).then((res) => res.json()),
		enabled: debouncedPrompt.length > 10,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	return (
		<Template title="Ask">
			<h1>Ask</h1>
			<p>
				You can ask this trained model about me, my experience and some of my
				tastes.
			</p>
			<InputWrapper>
				<IconBolt
					size={20}
					style={{ position: 'absolute', left: 6, top: 8 }}
					aria-hidden
				/>
				<Input
					type="text"
					minLength={10}
					maxLength={50}
					value={prompt}
					placeholder="Ask something..."
					onChange={(e) => setPrompt(e.target.value)}
				/>
			</InputWrapper>
			{(isInitialLoading || prompt !== debouncedPrompt) && prompt ? (
				<pre>Loading...</pre>
			) : data?.text ? (
				<pre>{data?.text}</pre>
			) : null}
		</Template>
	)
}

export default Ask
