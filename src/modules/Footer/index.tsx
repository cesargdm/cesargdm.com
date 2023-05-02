import Twitter from '../../assets/icons/Twitter'
import { socialItem } from './styles.css'

const year = new Date().getFullYear()

function Footer() {
	return (
		<footer>
			<p>&copy; {year}</p>
			<ul>
				<li className={socialItem}>
					<Twitter aria-hidden />
					Twitter
				</li>
				<li>GitHub</li>
				<li>LinkedIn</li>
				<li>Email</li>
			</ul>
		</footer>
	)
}

export default Footer
