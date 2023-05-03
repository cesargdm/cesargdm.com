declare module '*.mdx' {
	let MDXComponent: (props: any) => JSX.Element
	export default MDXComponent
}

declare module 'cookie-cutter' {
	export default {
		set(name: string, value: string, options?: any): void {
			return
		},
		get(name: string): string {
			return ''
		},
	}
}
