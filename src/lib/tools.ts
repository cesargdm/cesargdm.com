import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

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

/**
 * The URL segment for each tool, per locale.
 *
 * Single source of truth: the page files, the projects index and the language
 * switcher all read it from here. A tool's slug is part of its content — a
 * Spanish reader should get /es/projects/codigo-qr, not an English word — so
 * these deliberately differ per locale, and `getAlternateLocalePath` pairs them
 * the way `translationKey` pairs translated markdown slugs.
 */
export const TOOL_PATHS = {
	qrCodeGenerator: { en: 'qr-code-generator', es: 'codigo-qr' },
	cvReview: { en: 'cv-review', es: 'revisor-cv' },
	photoMosaic: { en: 'photo-mosaic', es: 'mosaico-de-fotos' },
} as const

export type ToolKey = keyof typeof TOOL_PATHS

const TOOLS: Record<Locale, Tool[]> = {
	en: [
		{
			path: TOOL_PATHS.qrCodeGenerator.en,
			title: 'QR Code Generator',
			description:
				'Turn any text into a QR code and download it as SVG or PNG. Runs entirely in your browser.',
		},
		{
			path: TOOL_PATHS.cvReview.en,
			title: 'CV Review',
			description:
				'Extract the text from a PDF résumé in the browser, so you can see what a parser sees.',
		},
		{
			path: TOOL_PATHS.photoMosaic.en,
			title: 'Photo Mosaic',
			description:
				'Rebuild any photo as a mosaic of your own images, matched by color and rendered entirely in your browser.',
		},
	],
	es: [
		{
			path: TOOL_PATHS.qrCodeGenerator.es,
			title: 'Generador de códigos QR',
			description:
				'Convierte cualquier texto en un código QR y descárgalo en SVG o PNG. Funciona por completo en tu navegador.',
		},
		{
			path: TOOL_PATHS.cvReview.es,
			title: 'Revisión de CV',
			description:
				'Extrae el texto de un CV en PDF desde el navegador, para ver lo que ve un parser.',
		},
		{
			path: TOOL_PATHS.photoMosaic.es,
			title: 'Mosaico de fotos',
			description:
				'Reconstruye cualquier foto como un mosaico hecho con tus propias imágenes, emparejadas por color y generado por completo en tu navegador.',
		},
	],
}

export function getTools(locale: Locale): Tool[] {
	return TOOLS[locale]
}

/** The tool a slug belongs to, whichever locale's slug it is. */
export function getToolKeyByPath(path: string): ToolKey | undefined {
	return (Object.keys(TOOL_PATHS) as ToolKey[]).find((key) =>
		LOCALES.some((locale) => TOOL_PATHS[key][locale] === path),
	)
}
