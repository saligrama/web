import moment from "moment";
import React from "react";
import vercelOGPagesPlugin from "@cloudflare/pages-plugin-vercel-og";

interface Props {
  title: string
  date: string
  wordCount: string
  inject: boolean
}

export const genOGImage = async (context) => {
  const loraFontData = await fetch(new URL('https://use.typekit.net/af/5a8032/00000000000000007735a0d8/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3')).then(
    (res) => res.arrayBuffer(),
  );

  const interFontData = await fetch(new URL('https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff')).then(
    (res) => res.arrayBuffer(),
  );

  return vercelOGPagesPlugin<Props>({
    imagePathSuffix: "og-image.png",
    component: ({ title, date, wordCount }) => {
      return (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '-.02em',
            background: '#fbf9ea',
          }}
        >
          <div
            style={{
              left: 50,
              top: 50,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              width="60"
              height="60"
              src={`https://avatars.githubusercontent.com/u/13177755?v=4`}
              style={{
                borderRadius: 128,
              }}
            />
            <span
              style={{
                marginLeft: 8,
                fontSize: 20,
                color: "#32302f",
                fontFamily: 'Inter',
              }}
            >
              saligrama.io
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px 50px',
              margin: '0 42px',
              fontSize: 32,
              width: 'auto',
              maxWidth: 800,
              textAlign: 'center',
              color: '#619e4c',
              fontFamily: 'Lora',
              lineHeight: 1.4,
            }}
          >
            {title}
          </div>

          <div
            style={{
              left: 100,
              bottom: 50,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginLeft: 8,
                fontFamily: 'Inter',
                fontSize: 20,
                color: "#c76680"
              }}
            >
              {date}
            </span>
          </div>

          <div
            style={{
              right: 100,
              bottom: 50,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginLeft: 8,
                fontFamily: 'Inter',
                fontSize: 20,
                color: "#c76680"
              }}
            >
              {wordCount}
            </span>
          </div>
        </div>
      )
    },
    options: {
      width: 800,
      height: 400,
      fonts: [
        {
          name: 'Lora',
          data: loraFontData,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interFontData,
          style: 'normal',
        }
      ],
    },
    extractors: {
      on: {
        'meta[property="og:title"]': (props) => ({
          element(element: Element) {
            props.title = element.getAttribute("content")?.replace(/&#39;/g, "'") ?? "Aditya Saligrama";
          }
        }),
        'meta[property="article:published_time"]': (props) => ({
          element(element: Element) {
            props.date = moment(element.getAttribute("content")).utcOffset(-8).format("MMMM D, YYYY") ?? "";
          }
        }),
        'meta[property="article:word_count"]': (props) => ({
          element(element: Element) {
            props.wordCount = `${element.getAttribute("content")} words` ?? "";
          }
        }),
      }
    },
    autoInject: {
      openGraph: true,
    },
  })(context)
}
