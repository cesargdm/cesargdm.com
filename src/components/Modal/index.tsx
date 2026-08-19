import { useCallback } from 'react'
import type { ReactNode } from 'react'

type Props = {
	onClose?: () => void
	children: ReactNode
}

export default function Modal(props: Props) {
	const { children, onClose } = props

	const handleOnClose = useCallback(() => {
		onClose?.()
	}, [onClose])

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
				<button type="button" onClick={handleOnClose} aria-label="Close modal">
					Close
				</button>
			</div>
			{children}
		</div>
	)
}
