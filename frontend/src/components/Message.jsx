import ReactMarkdown from "react-markdown";

function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-[#292724] text-white"
            : "rounded-bl-md bg-[#ebe7e1] text-[#37332e]"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,

              strong: ({ children }) => (
                <strong className="font-semibold text-[#292724]">
                  {children}
                </strong>
              ),

              ul: ({ children }) => (
                <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
              ),

              ol: ({ children }) => (
                <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
              ),

              li: ({ children }) => <li className="pl-1">{children}</li>,

              code: ({ children }) => (
                <code className="rounded bg-[#ddd8d1] px-1.5 py-0.5 font-mono text-xs">
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default Message;
