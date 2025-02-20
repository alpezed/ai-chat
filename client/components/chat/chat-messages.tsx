export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

export function ChatMessages({ messages }: { messages?: ChatMessage[] }) {
  return (
    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 pb-4 overflow-auto">
      {messages?.map(message => {
        if (message.role === "user") {
          return (
            <div className="flex w-full items-start gap-4 pt-2 pb-2">
              <div className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-100 h-8 w-8">
                <span className="text-brand-800 text-[16px] font-[400] leading-[16px]">
                  <svg
                    style={{
                      width: "1em",
                      height: "1em",
                      verticalAlign: "middle",
                      fill: "currentColor",
                      overflow: "hidden",
                    }}
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M170.666667 938.666667a341.333333 341.333333 0 1 1 682.666666 0h-85.333333a256 256 0 1 0-512 0H170.666667z m341.333333-384c-141.44 0-256-114.56-256-256s114.56-256 256-256 256 114.56 256 256-114.56 256-256 256z m0-85.333334c94.293333 0 170.666667-76.373333 170.666667-170.666666s-76.373333-170.666667-170.666667-170.666667-170.666667 76.373333-170.666667 170.666667 76.373333 170.666667 170.666667 170.666666z" />
                  </svg>
                </span>
              </div>
              <div className="flex grow shrink-0 basis-0 items-center gap-4 pt-1">
                <div
                  className="flex [&>*:first-child]:mt-0 flex-col gap-2 grow shrink-0 basis-0 text-body font-body text-default-font"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                ></div>
              </div>
            </div>
          );
        }

        return (
          <div className="flex w-full items-start gap-4 pt-2 pb-2">
            <div className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-green-100 h-8 w-8">
              <span className="text-brand-800 text-[16px] font-[400] leading-[16px]">
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
              </span>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <div className="flex w-full flex-col items-start pt-1">
                <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                  <div
                    className="[&>*:first-child]:mt-0"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
