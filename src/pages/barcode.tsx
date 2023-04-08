import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import {
	IconFile,
	IconBarcode,
	IconZoomQuestion,
	IconAlphabetLatin,
} from '@tabler/icons-react'
import bwipjs from 'bwip-js'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'

import Template from '../templates'

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

const BARCODE_TYPES = ['microqrcode', 'qrcode'] as const

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
	const [prompt, setPrompt] = useState('cesargdm.com')
	const [barcodeType, setBarcodeType] = useState('qrcode')
	const [fileType, setFileType] = useState('png' as 'png' | 'jpeg' | 'svg')
	const [options, setOptions] = useState({
		eclevel: 'M' as string | undefined,
	})

	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!prompt) return

		bwipjs.toCanvas('canvas', {
			...options,
			backgroundcolor: fileType === 'png' ? 'transparent' : 'ffffff',
			text: prompt,
			bcid: barcodeType,
			barcolor: 'ff00000',
			scale: 10,
		})
	}, [prompt, barcodeType, options, fileType])

	function handleDownload() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		downloadURI(canvasRef.current?.toDataURL(`image/${fileType}`), 'Download')
	}

	return (
		<Template title="Bar Code / QR Code">
			<h1>Barcode - QR Code</h1>
			<p>
				{`I don't like getting a dozen ads and sign-ups when I simply want a 
				QR code, so this is for us.`}
			</p>

			<Container>
				<div>
					<AspectRatio.Root
						ratio={1}
						style={{
							backgroundColor: 'var(--colors--background-secondary)',
							borderRadius: 'var(--border_radius--medium)',
							padding: 20,
						}}
					>
						<canvas
							style={{ width: '100%', height: '100%' }}
							id="canvas"
							ref={canvasRef}
						/>
					</AspectRatio.Root>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 'var(--spaces--medium)',
					}}
				>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label>
						<b>Content</b>
						<InputWrapper>
							<IconAlphabetLatin size={20} aria-hidden />
							<Input
								as="textarea"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
							/>
						</InputWrapper>
					</label>
					<label>
						<b>Barcode type</b>
						<InputWrapper>
							<IconBarcode aria-hidden />
							<select
								value={barcodeType}
								onChange={(e) => setBarcodeType(e.target.value)}
							>
								{BARCODE_TYPES.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</InputWrapper>
					</label>
					<label>
						<b>Error correction level</b>
						<InputWrapper>
							<IconZoomQuestion aria-hidden />
							<select
								value={options.eclevel}
								onChange={(e) => setOptions({ eclevel: e.target.value })}
							>
								<option value="L">Low</option>
								<option value="M">Medium</option>
								<option value="Q">Quality</option>
								<option value="H">High</option>
							</select>
						</InputWrapper>
					</label>
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
					<button onClick={handleDownload}>Download image</button>
				</div>
			</Container>
		</Template>
	)
}

export default Ask
