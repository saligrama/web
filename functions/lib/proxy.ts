import proxyflare from "@flaregun-net/proxyflare-for-pages"

export const proxy: PagesFunction = (context) => proxyflare({
  config: {
    routes: [
      {
        from: {
          pattern: "saligrama.io/notes/*",
        },
        to: {
          url: "https://saligrama-notes.pages.dev/",
        }
      },
      {
        from: {
          pattern: "saligrama.io/photo/*",
        },
        to: {
          url: "https://saligrama-photo.pages.dev/",
        }
      },
      {
        from: {
          pattern: "saligrama.pages.dev/*",
        },
        to: {
          url: "https://saligrama.io/",
        }
      }
    ]
  }
})(context)