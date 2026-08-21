import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

type Props = {
	locale: Locale
	onClose?: () => void
	children: ReactNode
}

export default function Modal(props: Props) {
	const { children, locale, onClose } = props

	const t = useMemo(() => getTranslate(locale), [locale])

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
				<button
					type="button"
					onClick={handleOnClose}
					aria-label={t('modal.closeLabel')}
				>
					{t('modal.close')}
				</button>
			</div>
			{children}
		</div>
	)
}
