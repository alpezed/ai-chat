import { type PropsWithChildren } from "hono/jsx";
import type { ChatMessage, Chat as PrismaChat } from "@prisma/client";

import Layout from "./shared/layout";

type ChatProps = PropsWithChildren<{
  chatId?: string;
  messages?: ChatMessage[];
  chats?: Pick<PrismaChat, "id" | "title">[];
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
        <script type="module" src="/client/pages/chat.tsx"></script>
      )}
      <script
        src="https://unpkg.com/@material-tailwind/html@3.0.0-beta.7/dist/material-tailwind.umd.min.js"
        defer
      ></script>
    </Layout>
  );
}
