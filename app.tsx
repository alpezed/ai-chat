import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { streamText } from "hono/streaming";
import { streamText as generateStream, generateText } from "ai";
import { togetherai } from "@ai-sdk/togetherai";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";
import { unified } from "unified";
import { PrismaClient } from "@prisma/client";

import IndexPage from "./pages";
import ChatPage from "./pages/chat";

const app = new Hono();
const prisma = new PrismaClient();

const togetherAiModel = togetherai("meta-llama/Llama-3.3-70B-Instruct-Turbo");

app.use("/static/*", serveStatic({ root: "./" }));

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

const chatTitleRoutes = app.post("/chat-title", async c => {
  const { chatId, prompt } = await c.req.json();

  const { text } = await generateText({
    model: togetherAiModel,
    system:
      "You write simple, clear, and concise content. Do NOT wrap the title in any quotes or special characters",
    prompt: `Generate a very short title based on the following prompt or question sent by the user: ${prompt}`,
  });
  const chat = await prisma.chat.update({
    where: { id: chatId },
    data: {
      title: text,
    },
  });
  return c.json({ chat });
});

const chatRoutes = app.post("/chat", async c => {
  const { history, chatId } = await c.req.json();
  const userMessage = history[history.length - 1];

  await prisma.chatMessage.create({
    data: {
      content: userMessage.content,
      role: "user",
      chatId,
    },
  });

  const { textStream } = await generateStream({
    model: togetherAiModel,
    messages: history,
  });

  let completedMessage = "";

  return streamText(c, async stream => {
    for await (const chunk of textStream) {
      completedMessage += chunk;
      const htmlFile = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeHighlightCodeLines, {
          showLineNumbers: true,
          lineContainerTagName: "div",
        })
        .use(rehypeStringify)
        .process(completedMessage);

      stream.write(String(htmlFile));
    }

    await prisma.chatMessage.create({
      data: {
        content: completedMessage,
        role: "assistant",
        chatId,
      },
    });
  });
});

app.get("/", c => c.html(<IndexPage />));

export default app;

export const routes = [chatRoutes, chatTitleRoutes] as const;

export type AppType = (typeof routes)[number];
