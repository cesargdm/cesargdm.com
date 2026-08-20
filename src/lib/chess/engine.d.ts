/**
 * Types for the Emscripten output in `engine.js`, which is generated and has
 * none of its own. Only `cwrap` is exported from the runtime — see
 * `src/wasm/c-chess/build.sh`.
 */
declare module '@/lib/chess/engine.js' {
	type ArgType = 'number' | 'string' | 'array' | 'boolean'

	export type ChessModule = {
		cwrap: (
			name: string,
			returnType: ArgType | null,
			argTypes: ArgType[],
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) => (...args: any[]) => any
	}

	const initEngine: () => Promise<ChessModule>

	export default initEngine
}
