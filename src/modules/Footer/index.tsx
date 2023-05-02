const year = new Date().getFullYear()

function Footer() {
	return (
		<footer>
			<p>&copy; {year}</p>
			<ul>
				<li>Twitter</li>
				<li>GitHub</li>
				<li>LinkedIn</li>
				<li>Email</li>
			</ul>
		</footer>
	)
}

export default Footer
