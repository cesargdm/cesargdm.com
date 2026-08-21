import * as QRCode from 'qrcode'
import { useEffect, useId, useState } from 'react'

import {
	actions,
	container,
	controls,
	download,
	errorText,
	field,
	preview,
	previewFrame,
	select as selectClass,
	textarea,
} from './styles.css'

const QR_MARGIN = 2
const QR_PNG_WIDTH = 1024
const TEXTAREA_ROWS = 5

const LEVELS = ['L', 'M', 'Q', 'H'] as const

type Level = (typeof LEVELS)[number]

type Copy = {
	textLabel: string
	textPlaceholder: string
	levelLabel: string
	levelHint: Record<Level, string>
	downloadSvg: string
	downloadPng: string
	empty: string
	tooLong: string
}

type Props = {
	copy: Copy
}

export default function QrCodeGenerator({ copy }: Props) {
	const textId = useId()
	const levelId = useId()

	const [value, setValue] = useState('')
	const [level, setLevel] = useState<Level>('M')
	const [svg, setSvg] = useState('')
	const [png, setPng] = useState('')
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		const trimmed = value.trim()

		if (!trimmed) {
			setSvg('')
			setPng('')
			setFailed(false)

			return
		}

		let cancelled = false
		const options = { errorCorrectionLevel: level, margin: QR_MARGIN }

		Promise.all([
			QRCode.toString(trimmed, { ...options, type: 'svg' }),
			QRCode.toDataURL(trimmed, { ...options, width: QR_PNG_WIDTH }),
		])
			.then(([nextSvg, nextPng]) => {
				if (cancelled) return

				setSvg(nextSvg)
				setPng(nextPng)
				setFailed(false)
			})
			.catch(() => {
				if (cancelled) return

				// The only realistic failure is exceeding the symbol's capacity,
				// which shrinks as the error-correction level rises.
				setSvg('')
				setPng('')
				setFailed(true)
			})

		return () => {
			cancelled = true
		}
	}, [value, level])

	const svgHref = svg
		? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
		: ''

	return (
		<div className={container}>
			<div className={controls}>
				<div className={field}>
					<label htmlFor={textId}>{copy.textLabel}</label>
					<textarea
						id={textId}
						className={textarea}
						rows={TEXTAREA_ROWS}
						value={value}
						placeholder={copy.textPlaceholder}
						onChange={(event) => setValue(event.target.value)}
					/>
				</div>

				<div className={field}>
					<label htmlFor={levelId}>{copy.levelLabel}</label>
					<select
						id={levelId}
						className={selectClass}
						value={level}
						onChange={(event) => setLevel(event.target.value as Level)}
					>
						{LEVELS.map((option) => (
							<option key={option} value={option}>
								{copy.levelHint[option]}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className={preview}>
				{failed ? (
					<p className={errorText} role="alert">
						{copy.tooLong}
					</p>
				) : svg ? (
					<>
						<div
							className={previewFrame}
							// The QR code is inline SVG injected as markup, so there is no
							// <img> to use instead; role + label is how it is announced.
							// eslint-disable-next-line jsx-a11y/prefer-tag-over-role
							role="img"
							aria-label={copy.textLabel}
							// The library emits pure path geometry — it never echoes the
							// input back as markup.
							dangerouslySetInnerHTML={{ __html: svg }}
						/>
						<div className={actions}>
							<a className={download} href={svgHref} download="qr-code.svg">
								{copy.downloadSvg}
							</a>
							<a className={download} href={png} download="qr-code.png">
								{copy.downloadPng}
							</a>
						</div>
					</>
				) : (
					<p className={errorText}>{copy.empty}</p>
				)}
			</div>
		</div>
	)
}
