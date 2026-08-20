import type { Locale } from '@/lib/i18n'

/**
 * Locale-routed micro-apps that live under /projects but are Astro pages rather
 * than markdown, so `getProjects` cannot see them and the projects index used to
 * omit them entirely. Listing them here keeps one place to add the next one.
 */
export type Tool = {
	path: string
	title: string
	description: string
}

const TOOLS: Record<Locale, Tool[]> = {
	en: [
		{
			path: 'qr-code-generator',
			title: 'QR Code Generator',
			description:
				'Turn any text into a QR code and download it as SVG or PNG. Runs entirely in your browser.',
		},
		{
			path: 'cv-review',
			title: 'CV Review',
			description:
				'Extract the text from a PDF résumé in the browser, so you can see what a parser sees.',
		},
	],
	es: [
		{
			path: 'qr-code-generator',
			title: 'Generador de códigos QR',
			description:
				'Convierte cualquier texto en un código QR y descárgalo en SVG o PNG. Funciona por completo en tu navegador.',
		},
		{
			path: 'cv-review',
			title: 'Revisión de CV',
			description:
				'Extrae el texto de un CV en PDF desde el navegador, para ver lo que ve un parser.',
		},
	],
}

export function getTools(locale: Locale): Tool[] {
	return TOOLS[locale]
}
