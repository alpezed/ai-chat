import { render, useState } from "hono/jsx/dom";
import { ChatHeader } from "./components/chat-header";
import { ChatInput } from "./components/chat-input";
import { ChatMessages } from "./components/chat-messages";
import { hc } from "hono/client";
import type { AppType } from "../app";
import type { ChatMessage } from "@prisma/client";
import { ChatSidebar } from "./components/chat-sidebar";

declare global {
  interface Window {
    chatId: string;
    messages: ChatMessage[];
  }
}

const client = hc<AppType>("http://localhost:3001/");

const chatId = window.chatId;
const initialMessages = window.messages;

function Chat() {
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const prompt = data.get("prompt") as string;

    const userMessage = {
      role: "user",
      content: prompt,
    } as ChatMessage;

    setChatMessages(messages => [...messages, userMessage]);

    form.reset();

    const response = await client.chat.$post({
      json: {
        history: [...chatMessages, userMessage],
        chatId: chatId,
      },
    });

    const stream = response.body;

    if (!stream) {
      throw new Error("Response body is not a stream");
    }

    const reader = stream.getReader();

    setChatMessages(messages => [
      ...messages,
      {
        role: "assistant",
        content: "",
      } as ChatMessage,
    ]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }

      const text = new TextDecoder().decode(value);

      setChatMessages(prevMessages => {
        const messages = prevMessages.slice();
        messages[messages.length - 1] = {
          role: "assistant",
          content: text,
        } as ChatMessage;
        return messages;
      });
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <div className="container prose prose-gray prose-sm prose-pre:text-base max-w-none flex h-full w-full flex-col items-center gap-6 bg-default-background pt-12 pr-6 pl-6">
          <ChatHeader />
          <div className="flex w-full max-w-[768px] grow shrink-0 basis-0 flex-col items-start relative">
            <ChatMessages messages={chatMessages} />
            <ChatInput onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById("chat");

if (!root) {
  throw new Error("Root element not found");
}

render(<Chat />, root);
