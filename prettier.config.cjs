const cretia = require('prettier-config-cretia')

/**
 * Prettier is used for `.astro` files only — oxfmt owns every other extension
 * (see .oxfmtrc.json) but does not recognise `.astro` at all.
 *
 * The shared Cretia settings are kept so the two formatters agree on the
 * things they both express: tabs, single quotes, no semicolons, trailing
 * commas.
 */
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
