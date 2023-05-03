import { ComponentProps } from 'react'

import { textInput } from './styles.css'

function TextInput({ type = 'text', ...props }: ComponentProps<'input'>) {
	return <input className={textInput} type={type} {...props} />
}

export default TextInput
