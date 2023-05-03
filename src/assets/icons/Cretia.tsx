import type { ComponentProps } from 'react'

function Cretia(props: ComponentProps<'svg'>) {
	return (
		<svg
			{...props}
			viewBox="0 0 95 80"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M94.999 32.607C94.834 58.682 73.614 79.8 47.5 79.8 21.284 79.8 0 58.516 0 32.3h15.2c0 17.827 14.473 32.3 32.3 32.3 17.827 0 32.3-14.473 32.3-32.3H95l-.001.307Z" />
			<circle cx="62.7" cy="15.2" r="7.6" />
			<path d="M22.8 0c13.636.027 24.7 11.107 24.7 24.751V45.6H32.3V24.751a9.614 9.614 0 0 0-.621-3.392 9.57 9.57 0 0 0-2.178-3.36 9.57 9.57 0 0 0-3.36-2.178 9.62 9.62 0 0 0-3.33-.621H17.1V0h5.7Z" />
		</svg>
	)
}

export default Cretia
