// https://github.com/codebude/QRCoder.wiki.git

import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import {
	IconFile,
	IconBarcode,
	IconZoomQuestion,
	IconAlphabetLatin,
} from '@tabler/icons-react'
import bwipjs from 'bwip-js'
import { useQueryParam, StringParam } from 'use-query-params'

import Template from '../../templates'

const Input = styled.input`
	font: inherit;
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
	display: block;

	svg {
		position: absolute;
		left: 6px;
		top: 8px;
	}
`

const Container = styled.div`
	display: flex;
	gap: var(--spaces--medium);
	flex-direction: column;
	align-items: flex-start;

	label {
		b {
			font-size: 1rem;
			display: block;
			font-weight: 700;
			margin-bottom: var(--spaces--small);
		}
	}

	select {
		padding: var(--spaces--medium) var(--spaces--large);
		padding-left: calc(var(--spaces--large) + 12px);
		border-radius: var(--border_radius--small);
		border: 1px solid var(--colors--border);
		font-size: 1rem;
		font-weight: 700;
		display: block;
		width: 100%;
		color: var(--colors--tint);
	}

	> div:first-child {
		order: 2;
	}

	@media (min-width: 500px) {
		flex-direction: row;

		> div:first-child {
			flex-basis: 40%;
		}

		> div:last-child {
			flex-basis: 60%;
		}
	}
`

const CONTENT_TYPES = [
	'Plain text',
	'BezahlCode',
	'Bitcoin',
	'Bookmark',
	'CalendarEvent',
	'ContactData',
	'Geolocation',
	'Girocode',
	'Mail',
	'MMS',
	'MoneroTransaction',
	'OneTimePassword',
	'PhoneNumber',
	'ShadowSocksConfig',
	'SkypeCall',
	'SlovenianUpnQr',
	'SMS',
	'SwissQrCode',
	'Url',
	'WhatsAppMessage',
	'WiF',
] as const

function downloadURI(uri: string, name: string) {
	const link = document.createElement('a')
	link.download = name
	link.title = 'Download'
	link.href = uri
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

function Ask() {
	const [text, setText] = useQueryParam('text', StringParam)
	const [eclevel, setEclevel] = useQueryParam('eclevel', StringParam)
	const [fileType, setFileType] = useState<'png' | 'jpeg' | 'svg'>('png')

	useEffect(() => {
		if (!text) setText('cesargdm.com')
		if (!eclevel) setEclevel('M')
	}, [text, eclevel])

	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!text || !eclevel) return

		bwipjs.toCanvas('canvas', {
			// @ts-ignore
			eclevel,
			bcid: 'qrcode' as string,
			backgroundcolor: fileType === 'png' ? 'transparent' : 'ffffff',
			text: text ?? 'cesargdm.com',
			barcolor: 'ff00000',
			scale: 10,
		})
	}, [text, eclevel, fileType])

	function handleDownload() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		downloadURI(canvasRef.current?.toDataURL(`image/${fileType}`), 'Download')
	}

	return (
		<Template title="QR Code Generator">
			<h1>QR Code Generator</h1>
			<p>
				{`I don't like getting a dozen ads and sign-ups when I simply want a 
				QR code, so this is for us.`}
			</p>

			<Container>
				<div
					style={{
						padding: 20,
						borderRadius: 'var(--border_radius--medium)',
						backgroundColor: '#f9f9f9',
					}}
				>
					<canvas style={{ width: '100%' }} id="canvas" ref={canvasRef} />
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 'var(--spaces--medium)',
					}}
				>
					<label>
						<b>Type</b>
						<InputWrapper>
							<IconBarcode aria-hidden />
							<select value="" onChange={() => undefined} disabled>
								{CONTENT_TYPES.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</InputWrapper>
					</label>

					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label>
						<b>Content</b>
						<InputWrapper>
							<IconAlphabetLatin size={20} aria-hidden />
							<Input
								as="textarea"
								value={text as string}
								onChange={(e) => setText(e.target.value)}
							/>
						</InputWrapper>
					</label>

					<label>
						<b>Error correction level</b>
						<InputWrapper>
							<IconZoomQuestion aria-hidden />
							<select
								value={eclevel as string}
								onChange={(e) => setEclevel(e.target.value)}
							>
								<option value="L">Low</option>
								<option value="M">Medium</option>
								<option value="Q">Quality</option>
								<option value="H">High</option>
							</select>
						</InputWrapper>
					</label>

					<hr />

					<label>
						<b>File type</b>
						<InputWrapper>
							<IconFile aria-hidden />
							<select
								value={fileType}
								onChange={(e) => setFileType(e.target.value as any)}
							>
								<option value="png">PNG</option>
								<option value="jpeg" disabled>
									JPEG
								</option>
								<option value="svg" disabled>
									SVG
								</option>
							</select>
						</InputWrapper>
					</label>
					<button onClick={handleDownload}>Download QR Code Image</button>
				</div>
			</Container>
		</Template>
	)
}

export default Ask
