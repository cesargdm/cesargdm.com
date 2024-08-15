'use client'

import { useState } from 'react'
import Script from 'next/script'
import type { FormEvent } from 'react'

type PDFDocumentProxy = {
	getPage: (pageNumber: number) => Promise<unknown>
	_pdfInfo: {
		numPages: number
		fingerprints: string[]
	}
}

type TextContent = {
	items: {
		str: string
		transform: number[]
		dir: string
	}[]
}

declare global {
	interface Window {
		'pdfjs-dist/build/pdf': {
			getDocument: (url: string) => {
				promise: Promise<PDFDocumentProxy>
			}
			GlobalWorkerOptions: {
				workerSrc: string
			}
		}
	}
}

export default function CvReview() {
	const [isPdfJsLoaded, setIsPdfJsLoaded] = useState(false)
	const [pdfTextResult, setPdfTextResult] = useState('')

	function handleOnLoad() {
		window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc =
			'//mozilla.github.io/pdf.js/build/pdf.worker.js'

		setIsPdfJsLoaded(true)
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (
			!('file' in event.target) ||
			typeof event.target.file !== 'object' ||
			!event.target.file ||
			!('files' in event.target.file)
		) {
			return
		}

		if (!event.target.file.files || !Array.isArray(event.target.file.files)) {
			return
		}

		const pdfUrl = URL.createObjectURL(event.target.file.files[0])

		if (!pdfUrl) {
			alert('No pdf data')
		}

		const pdfjsLib = window['pdfjs-dist/build/pdf']

		const loadingTask = pdfjsLib.getDocument(pdfUrl)

		try {
			const pdfDocumentProxy = await loadingTask.promise

			const maxPages = pdfDocumentProxy._pdfInfo.numPages

			const countPromises = []
			for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
				countPromises.push(
					// eslint-disable-next-line no-async-promise-executor
					new Promise(async (resolve) => {
						const page = (await pdfDocumentProxy.getPage(pageIndex)) as {
							getTextContent: () => TextContent
						}

						const text = await page.getTextContent()

						resolve(text.items.map((s) => s.str).join(' '))
					}),
				)
			}

			const pagesText = await Promise.all(countPromises)

			const completeText = pagesText.join('[NEXT PAGE]')

			setPdfTextResult(completeText)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
		}
	}

	return (
		<>
			<Script
				onLoad={handleOnLoad}
				src="//mozilla.github.io/pdf.js/build/pdf.js"
			/>
			<form onSubmit={handleSubmit}>
				<input type="file" name="file" />
				<button disabled={!isPdfJsLoaded} type="submit">
					Submit
				</button>
				<pre>
					<code>{pdfTextResult}</code>
				</pre>
			</form>
		</>
	)
}
