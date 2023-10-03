export function getHumanReadableDate(date: string | Date) {
	if (typeof date === 'object') {
		return date.toLocaleDateString()
	}

	return date
}
