import Gallery from '../components/Gallery'

export default {
  pageSerializers: (gallery: any[]) => ({
    types: {
      gallery: () => {
        return gallery.map(($0, index) => ({ ...$0, key: index })).map(Gallery)
      },
    },
  }),
}
