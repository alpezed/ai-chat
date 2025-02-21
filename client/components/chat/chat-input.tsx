import { useState } from "hono/jsx";
import { cx, css } from "hono/css";
import { cn } from "@/lib/utils";

export function ChatInput({ onSubmit }: { onSubmit: (event: Event) => void }) {
  const [input, setInput] = useState("");

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[768px] flex-col items-start gap-8 bg-default-background"
    >
      <input type="file" className="hidden" accept=".png,.jpeg,.gif,.webp" />
      <div className="flex w-full flex-col items-start gap-2 pb-4">
        <div className="flex w-full items-end gap-2 overflow-hidden rounded-2xl bg-neutral-100 pt-3 pr-4 pb-3 pl-4">
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded border-none bg-transparent disabled:cursor-default disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200 hover:bg-brand-50 active:bg-brand-100"
            type="button"
          >
            <span className="text-[18px] font-[500] leading-[18px] group-disabled/af9405b1:text-neutral-400 text-brand-700 group-hover/af9405b1:text-brand-700 group-active/af9405b1:text-brand-700 icon-module_root__7C4BA">
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
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </span>
            <div className="hidden text-[16px] font-[400] leading-[16px] group-disabled/af9405b1:text-neutral-400 text-brand-600 loader-module_root__-0Kak" />
          </button>
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
            <div className="flex w-full items-center gap-2">
              <label className="group/be48ca43 flex flex-col items-start gap-1 h-auto grow shrink-0 basis-0">
                <div className="flex h-8 w-full flex-none items-center gap-1 rounded pr-2 pl-2 group-focus-within/be48ca43:border group-focus-within/be48ca43:border-solid group-focus-within/be48ca43:border-brand-primary border border-solid border-neutral-100 bg-neutral-100 group-hover/be48ca43:border group-hover/be48ca43:border-solid group-hover/be48ca43:border-neutral-border group-focus-within/be48ca43:bg-default-background">
                  <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch pr-1 pl-1">
                    <input
                      className="h-full w-full border-none bg-transparent text-body font-body text-default-font outline-none"
                      placeholder="Chat with me..."
                      name="prompt"
                      onChange={(e: any) => setInput(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={input.length === 0}
                    className={cn(
                      "text-body cursor-pointer font-body hover:text-neutral-500",
                      {
                        "text-neutral-400 cursor-not-allowed":
                          input.length === 0,
                      }
                    )}
                  >
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
                      <polyline points="9 10 4 15 9 20" />
                      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                    </svg>
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>
        <span className="w-full text-xs text-gray-500/80 text-caption font-caption text-subtext-color text-center">
          AI can make mistakes. Always double check the source.
        </span>
      </div>
    </form>
  );
}
