import { useState } from "react";

function ChatInput({ onSend, onUpload, disabled, uploading }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#e5e0d9] bg-[#f7f5f2] px-3 py-4 sm:px-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-2xl border border-[#d8d2ca] bg-[#fffdfa] p-2 shadow-sm focus-within:border-[#aaa39a]">
          {/* Upload button */}
          <button
            onClick={onUpload}
            disabled={disabled}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#6d675f] transition hover:bg-[#eeeae4] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Upload PDF"
            title="Upload PDF"
          >
            {uploading ? (
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8 8 4-4 4 4"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
                />
              </svg>
            )}
          </button>

          {/* Text input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI..."
            rows={1}
            disabled={disabled}
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[#292724] outline-none placeholder:text-[#aaa49c] disabled:cursor-not-allowed"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#292724] text-white transition hover:bg-[#403d39] disabled:cursor-not-allowed disabled:bg-[#d7d2cc]"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 2 11 13"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m22 2-7 20-4-9-9-4 20-7Z"
              />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-[#a19b93]">
          Upload a PDF to add knowledge · Enter to send · Shift + Enter for new
          line
        </p>
      </div>
    </div>
  );
}

export default ChatInput;
