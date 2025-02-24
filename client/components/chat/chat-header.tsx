import { client } from "@/lib/client";

export function ChatHeader({ chatId }: { chatId: string }) {
  const onDeleteChat = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (confirm) {
      const result = await client.api.v1.chat[":chatId"].$delete({
        param: { chatId },
      });
      if (result.ok) {
        const allChats =
          chatId !== window.chats[0].id ? window.chats[0] : window.chats[1];
        window.location.href = `/chat/${allChats.id}`;
      }
    }
  };

  return (
    <div class="flex w-full max-w-[768px] items-center gap-4">
      <div class="flex grow shrink-0 basis-0 items-center gap-2">
        <span class="text-heading-2 font-heading-2 text-default-font icon-module_root__7C4BA">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
        </span>
        <button
          class="group/3b777358 flex h-8 cursor-pointer items-center justify-center gap-2 rounded border-none pr-3 pl-3 disabled:cursor-default disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200 bg-transparent hover:bg-neutral-50 active:bg-neutral-100"
          type="button"
          id="radix-:R15puja:"
          aria-haspopup="menu"
          aria-expanded="false"
          data-state="closed"
        >
          <div class="hidden h-4 w-4 flex-none items-center justify-center gap-2">
            <div class="text-body font-body group-disabled/3b777358:text-neutral-400 text-neutral-700 loader-module_root__-0Kak" />
          </div>
          <span class="whitespace-nowrap text-body-bold font-body-bold group-disabled/3b777358:text-neutral-400 text-neutral-600">
            AI Chat
          </span>
        </button>
      </div>
      {window.chatId && (
        <div class="flex items-center gap-2">
          <div class="dropdown" data-placement="bottom-end">
            <button
              class="flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded border-none bg-transparent hover:bg-neutral-50 active:bg-neutral-100 disabled:cursor-default disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200"
              type="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="text-[18px] font-[500] leading-[18px] text-neutral-600 group-disabled/af9405b1:text-neutral-400 icon-module_root__7C4BA">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={19} cy={12} r={1} />
                  <circle cx={5} cy={12} r={1} />
                </svg>
              </span>
            </button>
            <div
              data-role="menu"
              class="hidden min-w-28 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl shadow-slate-950/[0.025] p-1 z-10"
            >
              <button
                type="button"
                class="block w-full cursor-pointer px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md"
                onClick={onDeleteChat}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
