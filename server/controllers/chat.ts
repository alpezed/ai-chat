import { type Context } from "hono";
import { streamText } from "hono/streaming";
import { streamText as generateStream, generateText } from "ai";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import { PrismaClient } from "@prisma/client";
import { togetherAiModel } from "@/utils/ai";

const prisma = new PrismaClient();

export const updateChatTitle = async (c: Context) => {
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
};

export const createChat = async (c: Context) => {
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
};

export const deleteChat = async (c: Context) => {
  const { chatId } = c.req.param();

  if (!chatId) {
    return c.json({ message: "Chat ID is required" }, 400);
  }

  await prisma.chatMessage.deleteMany({
    where: {
      chatId,
    },
  });

  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  return c.json({ message: "Chat deleted" });
};
