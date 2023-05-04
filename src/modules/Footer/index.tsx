export default async function Footer() {
	const data = await fetch('/api/slack/users-info').then((response) =>
		response.json(),
	)

	return <footer>&copy; César Guadarrama</footer>
}
