/**
 * Parses JSON from a Request or Response with an explicit return type.
 *
 * `.json()` resolves to `unknown`, so this keeps the necessary cast in one place
 * (avoids scattered assertions that lint autofix would otherwise strip).
 */
export async function readJson<T>(source: {
	json: () => Promise<unknown>
}): Promise<T> {
	return (await source.json()) as T
}
