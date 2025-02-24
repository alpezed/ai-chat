import { Hono } from "hono";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import { PrismaClient } from "@prisma/client";

import { sessionMiddleware } from "@/server/middleware/session";
import { unAuthMiddleware } from "@/server/middleware/view";
import type { AuthSession } from "@/server/types/session";

import ChatPage from "../view/chat";
import IndexPage from "../view";
import SignInPage from "../view/sign-in";
import SignUpPage from "../view/sign-up";

const prisma = new PrismaClient();
const app = new Hono<{ Variables: AuthSession }>();

app.get("/chat/:chatId?", sessionMiddleware, async c => {
  const user = c.get("user");
  const { chatId } = c.req.param();

  if (!chatId && !user) {
    c.redirect("/chat");
    return c.html(<ChatPage />);
  }

  if (!chatId && user) {
    const newChat = await prisma.chat.create({
      data: {
        userId: user?.id ?? null,
      },
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
    where: { userId: user?.id },
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

app.get("/sign-in", sessionMiddleware, unAuthMiddleware, c =>
  c.html(<SignInPage />)
);

app.get("/sign-up", sessionMiddleware, unAuthMiddleware, c =>
  c.html(<SignUpPage />)
);

app.get("/", c => c.html(<IndexPage />));

export default app;
