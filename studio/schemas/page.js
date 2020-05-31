export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'localeBlock',
    },
  ],

  preview: {
    select: {
      title: 'title.en',
    },
  },
}
