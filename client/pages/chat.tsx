import { render, use, useEffect, useState } from "hono/jsx/dom";
import type { ChatMessage, Chat as PrismaChat } from "@prisma/client";

import { client } from "@/lib/client";

import { ChatSidebar } from "../components/chat/chat-sidebar";
import { ChatHeader } from "../components/chat/chat-header";
import { ChatInput } from "../components/chat/chat-input";
import { ChatMessages } from "../components/chat/chat-messages";

declare global {
  interface Window {
    chatId: string;
    messages: ChatMessage[];
    chats: Pick<PrismaChat, "id" | "title">[];
  }
}

const $post = client.api.v1.chat.$post;
const $chatTitle = client.api.v1.chat["chat-title"].$put;

const chatId = window.chatId;
const initialMessages = window.messages;
const initialChats = window.chats;

function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    initialMessages ?? []
  );
  const [chats, setChats] = useState(initialChats ?? []);

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const prompt = data.get("prompt") as string;

    if (!prompt) {
      return;
    }

    if (chatMessages?.length === 0 && chatId) {
      $chatTitle({
        json: { chatId, prompt },
      })
        .then(response => response.json())
        .then(data => {
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === chatId ? { ...chat, title: data.chat.title } : chat
            )
          );
        });
    }

    const userMessage = {
      role: "user",
      content: prompt,
    } as ChatMessage;

    setChatMessages(messages => [...messages, userMessage]);

    form.reset();

    const response = await $post({
      json: {
        history: chatMessages.concat(userMessage),
        chatId: chatId ?? undefined,
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

    while (reader) {
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
      {chatId && <ChatSidebar chats={chats} />}
      <div className="flex-1 flex flex-col">
        <div className="container prose prose-gray prose-a:no-underline prose-sm prose-pre:text-base max-w-none flex h-full w-full flex-col items-center gap-6 bg-default-background pt-12 pr-6 pl-6">
          <ChatHeader chatId={chatId} />
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
