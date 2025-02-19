import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { streamText } from "hono/streaming";
import { streamText as generateText } from "ai";
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

  for (const message of chat.messages) {
    const htmlFile = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(message.content);

    message.content = htmlFile.toString();
  }

  return c.html(<ChatPage chatId={chatId} messages={chat.messages} />);
});
const routes = app.post("/chat", async c => {
  const { history, chatId } = await c.req.json();
  const userMessage = history[history.length - 1];

  await prisma.chatMessage.create({
    data: {
      content: userMessage.content,
      role: "user",
      chatId,
    },
  });

  const { textStream } = await generateText({
    model: togetherai("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
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
export type AppType = typeof routes;
