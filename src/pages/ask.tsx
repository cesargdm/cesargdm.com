import React, { useState } from 'react'
import styled from '@emotion/styled'
import { IconQuestionMark } from '@tabler/icons-react'

import Template from '../templates'
import useDebounce from '../utils/useDebounce'
import { useQuery } from '@tanstack/react-query'

const Input = styled.input`
	padding: var(--spaces--medium) var(--spaces--large);
	border-radius: var(--border_radius--small);
	border: 1px solid var(--colors--border);
	font-size: 1rem;
`

function Ask() {
	const [prompt, setPrompt] = useState('')
	const debouncedPrompt = useDebounce(prompt, 1000)

	const { data } = useQuery({
		queryKey: ['ask'],
		queryFn: () =>
			window.fetch(`/api/ask?prompt=${debouncedPrompt}`, {
				method: 'GET',
			}),
		enabled: debouncedPrompt.length > 10,
	})

	return (
		<Template title="Ask">
			<h1>Ask</h1>
			<p>
				You can ask this trained model about me, my experience and some of my
				tastes.
			</p>
			<div>
				<IconQuestionMark />
				<Input
					type="text"
					minLength={10}
					maxLength={50}
					value={prompt}
					placeholder="Ask something..."
					onChange={(e) => setPrompt(e.target.value)}
				/>
			</div>
			<p>{JSON.stringify(data, null, 2)}</p>
		</Template>
	)
}

export default Ask
