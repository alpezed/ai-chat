import { type PropsWithChildren } from "hono/jsx";
import Layout from "./shared/layout";
import type { ChatMessage } from "@prisma/client";

type Chat = PropsWithChildren<{
  chatId: string;
  messages: ChatMessage[];
}>;

export default function ChatPage(props: Chat) {
  return (
    <Layout>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.chatId = ${JSON.stringify(
            props.chatId
          )}; window.messages = ${JSON.stringify(props.messages)}`,
        }}
      />
      <div id="chat"></div>
      {import.meta.env.PROD ? (
        <script type="module" src="/static/client.js"></script>
      ) : (
        <script type="module" src="/client/chat.tsx"></script>
      )}
    </Layout>
  );
}
