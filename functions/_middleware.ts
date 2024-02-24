import proxyflare from "@flaregun-net/proxyflare-for-pages"

export const onRequest: PagesFunction[] = [
  (context) => proxyflare({
    config: {
      routes: [
        {
          from: {
            pattern: "saligrama.pages.dev/blog/*"
          },
          to: {
            url: "https://saligrama-blog.pages.dev/",
          }
        },
        {
          from: {
            pattern: "saligrama.pages.dev/notes/*"
          },
          to: {
            url: "https://saligrama-notes.pages.dev/",
          }
        }
      ]
    }
  })(context)
]