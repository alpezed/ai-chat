import type { Chat } from "@prisma/client";

export function ChatSidebar({
  chats,
}: {
  chats: Pick<Chat, "id" | "title">[];
}) {
  console.log({ chats });
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Top section */}
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

      {/* New Chat button */}
      <button className="mx-4 justify-center text-sm flex items-center gap-2 mb-4 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800">
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

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-2">
          {/* Example chat items */}
          <button className="w-full cursor-pointer text-sm text-left px-3 py-2 rounded-xl hover:bg-gray-200 group">
            <div className="flex items-center gap-3">
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium text-gray-900">
                  Chat Title Goes Here
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* User section */}
      <div className="p-4 text-sm border-t border-gray-200 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        <span className="font-medium">Username</span>
      </div>
    </div>
  );
}
