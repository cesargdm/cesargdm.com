import type { Locale } from '@/lib/i18n'

/**
 * Copy for the QR generator, shared by the two locale-slugged pages that render
 * it (/en/projects/qr-code-generator and /es/projects/codigo-qr).
 */
export const QR_COPY = {
	en: {
		title: 'QR Code Generator',
		description:
			'Generate a QR code from any text and download it as SVG or PNG. Runs entirely in your browser — nothing is uploaded.',
		intro:
			'Type anything — a URL, a wifi password, a paragraph — and download the result as a vector or a bitmap. Everything runs in your browser: the text never leaves this page and there is no server to send it to.',
		textLabel: 'Text',
		textPlaceholder: 'https://cesargdm.com',
		levelLabel: 'Error correction',
		levelHint: {
			L: 'Low — smallest code, least damage tolerated',
			M: 'Medium — the usual choice',
			Q: 'Quartile — survives a scuffed print',
			H: 'High — largest code, most robust',
		},
		downloadSvg: 'Download SVG',
		downloadPng: 'Download PNG',
		empty: 'Your code will appear here.',
		tooLong:
			'That is more text than a QR code can hold at this error-correction level. Shorten it, or drop to a lower level.',
		noscript:
			'Your code will appear here. This tool needs JavaScript, because it does all its work in your browser rather than on a server.',
	},
	es: {
		title: 'Generador de códigos QR',
		description:
			'Genera un código QR a partir de cualquier texto y descárgalo en SVG o PNG. Funciona por completo en tu navegador — nada se sube.',
		intro:
			'Escribe lo que quieras — una URL, una contraseña de wifi, un párrafo — y descarga el resultado como vector o como mapa de bits. Todo ocurre en tu navegador: el texto nunca sale de esta página y no hay servidor al que enviarlo.',
		textLabel: 'Texto',
		textPlaceholder: 'https://cesargdm.com',
		levelLabel: 'Corrección de errores',
		levelHint: {
			L: 'Baja — código más pequeño, tolera menos daño',
			M: 'Media — la opción habitual',
			Q: 'Cuartil — sobrevive a una impresión maltratada',
			H: 'Alta — código más grande, más robusto',
		},
		downloadSvg: 'Descargar SVG',
		downloadPng: 'Descargar PNG',
		empty: 'Tu código aparecerá aquí.',
		tooLong:
			'Es más texto del que cabe en un código QR con este nivel de corrección. Acórtalo o baja el nivel.',
		noscript:
			'Tu código aparecerá aquí. Esta herramienta necesita JavaScript, porque hace todo su trabajo en tu navegador y no en un servidor.',
	},
} as const

export type QrCopy = (typeof QR_COPY)[Locale]
