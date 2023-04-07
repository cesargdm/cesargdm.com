declare module '*.svg' {
	const content: any
	export default content
}

// Declare for 'colorthief' module

declare module 'colorthief' {
	export default class ColorThief {
		getColor(sourceImage: HTMLImageElement): number[]
	}
}
