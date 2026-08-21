/**
 * Turning a user's selection into a list of photos.
 *
 * Picking a folder is the realistic case — nobody shift-selects six hundred
 * files — so both the folder input and a dropped folder have to work, and both
 * hand back plenty of things that are not images.
 */

/**
 * Extensions checked in addition to the MIME type.
 *
 * A folder pick or a drop often yields files whose `type` is empty (HEIC in
 * Chrome, anything the OS has no mapping for), so filtering on `type` alone
 * silently discards photos the user can plainly see in the folder.
 */
const IMAGE_EXTENSIONS = /\.(?:avif|bmp|gif|hei[cf]|jpe?g|png|tiff?|webp)$/i

/** Deep enough for any real photo library, shallow enough to not walk a home directory. */
const MAX_DIRECTORY_DEPTH = 8

export function isImageFile(file: File): boolean {
	// macOS folders carry .DS_Store, and picking a folder returns every one of
	// them; they are not images by either test, which is the point.
	return file.type.startsWith('image/') || IMAGE_EXTENSIONS.test(file.name)
}

export function imageFilesFrom(files: Iterable<File>): File[] {
	return [...files].filter((file) => isImageFile(file))
}

/**
 * `readEntries` returns at most 100 entries per call and signals the end with an
 * empty batch, so a single call silently truncates a large folder.
 */
function readAllEntries(
	reader: FileSystemDirectoryReader,
): Promise<FileSystemEntry[]> {
	return new Promise((resolve, reject) => {
		const all: FileSystemEntry[] = []

		function readBatch() {
			reader.readEntries((batch) => {
				if (batch.length === 0) {
					resolve(all)
					return
				}
				all.push(...batch)
				readBatch()
			}, reject)
		}

		readBatch()
	})
}

function fileFromEntry(entry: FileSystemFileEntry): Promise<File | null> {
	return new Promise((resolve) => {
		entry.file(
			(file) => resolve(file),
			() => resolve(null),
		)
	})
}

async function collectFromEntry(
	entry: FileSystemEntry,
	depth: number,
	out: File[],
): Promise<void> {
	if (entry.isFile) {
		const file = await fileFromEntry(entry as FileSystemFileEntry)
		if (file && isImageFile(file)) out.push(file)
		return
	}

	if (!entry.isDirectory || depth >= MAX_DIRECTORY_DEPTH) return

	const reader = (entry as FileSystemDirectoryEntry).createReader()
	const entries = await readAllEntries(reader)
	for (const child of entries) {
		await collectFromEntry(child, depth + 1, out)
	}
}

/**
 * Every image in a drop, walking into folders where the browser exposes them.
 *
 * `webkitGetAsEntry` is what makes a dropped folder readable; without it a
 * folder arrives as a single unusable `File`. It is non-standard but present in
 * every browser this tool supports. Falls back to the flat file list otherwise.
 */
export async function imageFilesFromDrop(
	dataTransfer: DataTransfer,
): Promise<File[]> {
	const items = [...dataTransfer.items]
	const entries = items
		.map((item) => (item.kind === 'file' ? item.webkitGetAsEntry() : null))
		.filter((entry): entry is FileSystemEntry => entry !== null)

	if (entries.length === 0) return imageFilesFrom(dataTransfer.files)

	const collected: File[] = []
	for (const entry of entries) {
		await collectFromEntry(entry, 0, collected)
	}

	return collected
}
