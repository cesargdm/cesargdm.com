export async function getAssets() {
	return fetch('https://cesargdm.com/api/assets')
		.then((res) => res.json())
		.catch(console.log)
}
