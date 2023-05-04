export function getCheerFromVisitsCount(visitsCount: string) {
	const visitsCountNumber = Number(visitsCount)

	if (visitsCountNumber <= 2) {
		return 'again'
	}

	if (visitsCountNumber <= 10) {
		return 'buddy'
	}

	if (visitsCountNumber <= 20) {
		return 'friend'
	}

	if (visitsCountNumber <= 30) {
		return 'staker'
	}

	if (visitsCountNumber <= 50) {
		return 'mom'
	}

	return 'debugger'
}
