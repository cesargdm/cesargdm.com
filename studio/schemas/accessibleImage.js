export default {
  name: 'accessibleImage',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      options: {
        isHighlighted: true,
      },
    },
    {
      name: 'alternate',
      type: 'string',
      title: 'Alternate text',
      options: {
        isHighlighted: true,
      },
    },
  ],
}
