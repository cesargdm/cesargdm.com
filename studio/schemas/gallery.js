export default {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
    },
    { name: 'slug', title: 'Slug', type: 'string' },
    {
      title: 'Featured gallery',
      name: 'featured',
      type: 'boolean',
    },
    {
      title: 'Hero',
      name: 'hero',
      type: 'accessibleImage',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'localeBlock',
    },
  ],
}
