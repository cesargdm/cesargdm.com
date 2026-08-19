const cretia = require('prettier-config-cretia')

/** @type {import('prettier').Config} */
module.exports = {
	...cretia,
	plugins: [...(cretia.plugins ?? []), 'prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: { parser: 'astro' },
		},
	],
}
