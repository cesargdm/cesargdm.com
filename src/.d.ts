// mock 'cookie-cutter' module

declare module 'cookie-cutter' {
	export default {
		set(name: string, value: string, options?: any) {
			return true
		},
		get(name: string): string {
			return ''
		},
	}
}
