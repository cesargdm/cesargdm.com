'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

type Props = {
	onClose?: () => undefined
	children: ReactNode
}

export default function Modal(props: Props) {
	const { children, onClose } = props

	const router = useRouter()

	const handleOnClose = useCallback(() => {
		router.back()
		onClose?.()
	}, [])

	return (
		<div
			style={{
				top: '50%',
				left: '50%',
				width: '100%',
				height: '100%',
				maxWidth: '600px',
				maxHeight: '600px',
				position: 'absolute',
				borderRadius: '10px',
				backgroundColor: 'white',
				transform: 'translate(-50%, -50%)',
			}}
		>
			<div>
				<button onClick={handleOnClose}>Close</button>
			</div>
			{children}
		</div>
	)
}
