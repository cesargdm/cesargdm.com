import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import type { CvCopy } from '@/lib/cv-copy'

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

const PDF_JS_SRC = '//mozilla.github.io/pdf.js/build/pdf.js'

export default function CvReview({ copy }: { copy: CvCopy }) {
	const [isPdfJsLoaded, setIsPdfJsLoaded] = useState(false)
	const [pdfTextResult, setPdfTextResult] = useState('')

	useEffect(() => {
		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${PDF_JS_SRC}"]`,
		)

		function handleOnLoad() {
			window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc =
				'//mozilla.github.io/pdf.js/build/pdf.worker.js'

			setIsPdfJsLoaded(true)
		}

		if (existing) {
			handleOnLoad()
			return
		}

		const script = document.createElement('script')
		script.src = PDF_JS_SRC
		script.addEventListener('load', handleOnLoad)
		document.body.appendChild(script)
	}, [])

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

		// A FileList is array-like but not an Array, so the previous
		// Array.isArray check was always false and the handler returned here
		// every time — the form did nothing at all.
		const files = event.target.file.files as FileList | null
		const file = files?.item(0)

		if (!file) return

		const pdfUrl = URL.createObjectURL(file)

		const pdfjsLib = window['pdfjs-dist/build/pdf']

		const loadingTask = pdfjsLib.getDocument(pdfUrl)

		try {
			const pdfDocumentProxy = await loadingTask.promise

			const maxPages = pdfDocumentProxy._pdfInfo.numPages

			const countPromises = []
			for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
				countPromises.push(
					new Promise((resolve, reject) => {
						;(async () => {
							const page = (await pdfDocumentProxy.getPage(pageIndex)) as {
								getTextContent: () => Promise<TextContent>
							}

							const text = await page.getTextContent()

							resolve(text.items.map((item) => item.str).join(' '))
						})().catch(reject)
					}),
				)
			}

			const pagesText = await Promise.all(countPromises)

			const completeText = pagesText.join('[NEXT PAGE]')

			setPdfTextResult(completeText)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
		} finally {
			// The object URL pins the file in memory until it is released.
			URL.revokeObjectURL(pdfUrl)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type="file" name="file" />
			<button disabled={!isPdfJsLoaded} type="submit">
				{isPdfJsLoaded ? copy.submit : copy.loading}
			</button>
			<pre>
				<code>{pdfTextResult}</code>
			</pre>
		</form>
	)
}
