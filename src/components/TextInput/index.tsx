import { ComponentProps } from 'react'

import { textInput } from './styles.css'

function TextInput({ type = 'text' }: ComponentProps<'input'>) {
	return <input className={textInput} type={type} />
}

export default TextInput
