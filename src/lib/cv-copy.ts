import type { Locale } from '@/lib/i18n'

/**
 * Copy for the CV reader, shared by the two locale-slugged pages that render it
 * (/en/projects/cv-review and /es/projects/revisor-cv).
 *
 * The page previously rendered the bare component with no heading, no
 * description and no metadata title, in both locales.
 */
export const CV_COPY = {
	en: {
		title: 'CV Review',
		description:
			'Extract the text from a PDF résumé in your browser, so you can see what an applicant tracking system sees.',
		intro:
			'Most applications are read by a parser before a person ever opens them, and a résumé that looks fine to you can come out as noise. Pick a PDF and this shows you the plain text a parser pulls out of it. Everything runs in your browser — the file is never uploaded.',
		submit: 'Extract text',
		loading: 'Loading the PDF reader…',
		noscript:
			'This tool needs JavaScript, because it reads the PDF in your browser rather than on a server.',
	},
	es: {
		title: 'Revisión de CV',
		description:
			'Extrae el texto de un CV en PDF desde tu navegador, para ver lo que ve un sistema de seguimiento de candidatos.',
		intro:
			'La mayoría de las postulaciones las lee un parser antes de que una persona las abra, y un CV que a ti te parece impecable puede salir convertido en ruido. Elige un PDF y aquí verás el texto plano que un parser saca de él. Todo ocurre en tu navegador: el archivo nunca se sube.',
		submit: 'Extraer texto',
		loading: 'Cargando el lector de PDF…',
		noscript:
			'Esta herramienta necesita JavaScript, porque lee el PDF en tu navegador y no en un servidor.',
	},
} as const

export type CvCopy = (typeof CV_COPY)[Locale]
