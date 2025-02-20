import type { PropsWithChildren } from "hono/jsx";

export default function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>AI Researcher</title>
        {import.meta.env.DEV ? (
          <link rel="stylesheet" href="/client/global.css" />
        ) : (
          <link rel="stylesheet" href="/static/assets/global.css" />
        )}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github-dark.min.css"
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
