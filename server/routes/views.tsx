import { Hono } from "hono";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import { PrismaClient } from "@prisma/client";

import ChatPage from "../view/chat";
import IndexPage from "../view";

const app = new Hono();
const prisma = new PrismaClient();

app.get("/chat/:chatId?", async c => {
  const { chatId } = c.req.param();

  if (!chatId) {
    const newChat = await prisma.chat.create({
      data: {},
    });

    return c.redirect(`/chat/${newChat.id}`);
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });

  if (!chat) {
    c.status(404);
    return c.html(<h1>Chat not found</h1>);
  }

  const chats = await prisma.chat.findMany({
    select: { id: true, title: true },
  });

  for (const message of chat.messages) {
    const htmlFile = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(message.content);

    message.content = htmlFile.toString();
  }

  return c.html(
    <ChatPage chatId={chatId} messages={chat.messages} chats={chats} />
  );
});

app.get("/chat", c => c.html(<IndexPage />));

export default app;
