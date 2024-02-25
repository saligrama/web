import proxyflare from "@flaregun-net/proxyflare-for-pages"

export const onRequest: PagesFunction[] = [
  (context) => proxyflare({
    config: {
      routes: [
        {
          from: {
            pattern: "saligrama.io/blog/*"
          },
          to: {
            url: "https://saligrama-blog.pages.dev/",
          }
        },
        {
          from: {
            pattern: "saligrama.io/notes/*"
          },
          to: {
            url: "https://saligrama-notes.pages.dev/",
          }
        },
        {
          from: {
            pattern: "saligrama.io/photo/*"
          },
          to: {
            url: "https://saligrama-photo.pages.dev/",
          }
        }
      ]
    }
  })(context)
]