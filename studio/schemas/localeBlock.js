const supportedLanguages = [
  { id: 'en', title: 'English', isDefault: true },
  { id: 'es', title: 'Spanish' },
]

export default {
  name: 'localeBlock',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true },
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'blockContent',
    fieldset: lang.isDefault ? null : 'translations',
  })),
}
