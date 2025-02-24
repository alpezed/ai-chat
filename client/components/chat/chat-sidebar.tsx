import { authClient } from "@/lib/auth-client";
import type { Chat } from "@prisma/client";
import type { Session, User } from "better-auth";
import { useEffect, useState } from "hono/jsx";

function ChatTopBar() {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"></path>
        </svg>
        <span className="font-semibold">GPT</span>
      </div>
      <button className="p-2 hover:bg-gray-200 rounded-full">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}

function ChatNewButton() {
  return (
    <button
      className="mx-4 cursor-pointer justify-center text-sm flex items-center gap-2 mb-4 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
      onClick={() => {
        window.location.href = "/chat";
      }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>{" "}
      New Chat
    </button>
  );
}

function ChatList({ chats }: { chats: Pick<Chat, "id" | "title">[] }) {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      {chats?.map(chat => (
        <button
          key={chat.id}
          onClick={() => (window.location.href = `/chat/${chat.id}`)}
          className={`w-full cursor-pointer text-sm text-left px-3 py-2 rounded-xl hover:bg-gray-200 group ${chat.id === window.chatId ? "bg-gray-200" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium text-gray-600">
                {chat.title}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function ChatUser() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      const { data: session } = await authClient.getSession();
      setUser(session?.user);
    })();
  }, []);

  async function onSignout() {
    await authClient.signOut();
    window.location.href = "/sign-in";
  }

  if (!window.chatId) {
    return (
      <div className="p-4 text-sm border-t border-gray-200 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            style="width: 1em; height: 1em; vertical-align: middle; fill: currentcolor; overflow: hidden;"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M170.666667 938.666667a341.333333 341.333333 0 1 1 682.666666 0h-85.333333a256 256 0 1 0-512 0H170.666667z m341.333333-384c-141.44 0-256-114.56-256-256s114.56-256 256-256 256 114.56 256 256-114.56 256-256 256z m0-85.333334c94.293333 0 170.666667-76.373333 170.666667-170.666666s-76.373333-170.666667-170.666667-170.666667-170.666667 76.373333-170.666667 170.666667 76.373333 170.666667 170.666667 170.666666z"></path>
          </svg>
        </div>
        <span className="font-medium">Guest</span>
      </div>
    );
  }

  return (
    <div className="p-4 text-sm border-t border-gray-200">
      <div class="dropdown" data-placement="top-start">
        <button
          class="flex items-center gap-3 cursor-pointer"
          data-toggle="dropdown"
        >
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            {user?.name?.[0]}
          </div>
          <span className="font-medium">{user?.name}</span>
        </button>
        <div
          data-role="menu"
          class="hidden w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl shadow-gray-950/[0.025] p-1 z-10"
        >
          <button class="w-full cursor-pointer text-left block px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
            Settings
          </button>
          <button
            class="w-full cursor-pointer text-left block px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            onClick={onSignout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatSidebar({
  chats,
}: {
  chats: Pick<Chat, "id" | "title">[];
}) {
  return (
    <div class="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <ChatTopBar />
      <ChatNewButton />
      <ChatList chats={chats} />
      <ChatUser />
    </div>
  );
}
