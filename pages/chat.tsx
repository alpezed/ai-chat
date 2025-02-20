import { type PropsWithChildren } from "hono/jsx";
import Layout from "./shared/layout";
import type { ChatMessage, Chat as PrismaChat } from "@prisma/client";

type ChatProps = PropsWithChildren<{
  chatId: string;
  messages: ChatMessage[];
  chats: Pick<PrismaChat, "id" | "title">[];
}>;

export default function ChatPage(props: ChatProps) {
  return (
    <Layout>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.chatId = ${JSON.stringify(props.chatId)}; 
          window.messages = ${JSON.stringify(props.messages)}; 
          window.chats = ${JSON.stringify(props.chats)}`,
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
