import { useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [sessionId] = useState(() => crypto.randomUUID());

  const fileInputRef = useRef(null);

  console.log("Session Id (frontend): ", sessionId);

  const sendMessage = async (text) => {
    if (!text.trim() || loading || uploading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    setUploadedFile(file);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${file.name} has been uploaded successfully. You can now ask questions about it.`,
        },
      ]);

      console.log(data);
    } catch (error) {
      console.error(error);

      setUploadedFile(null);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to upload the PDF. Please try again.",
        },
      ]);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const openFilePicker = () => {
    if (!loading && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#f7f5f2]">
      {/* Header */}
      <header className="border-b border-[#e5e0d9] bg-[#f7f5f2] px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#292724]">
              Enterprise Chat
            </h1>

            <p className="text-xs text-[#8a857e]">
              AI-powered knowledge assistant
            </p>
          </div>

          {uploadedFile && (
            <div className="hidden items-center gap-2 rounded-lg bg-[#ebe7e1] px-3 py-2 text-xs text-[#625d56] sm:flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 2v6h6"
                />
              </svg>

              <span className="max-w-40 truncate">{uploadedFile.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-[60vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9e4dc]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-7 w-7 text-[#6f685f]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18h.01M8.21 8.21a5.5 5.5 0 1 1 7.78 0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.64 5.64a9 9 0 0 1 12.72 0"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-semibold text-[#292724]">
                  How can I help you?
                </h2>

                <p className="mt-2 text-[#817b73]">
                  Upload a document and ask questions about it.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {loading && <Message role="assistant" content="Thinking..." />}

              {uploading && (
                <Message
                  role="assistant"
                  content="Uploading and processing your document..."
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        onUpload={openFilePicker}
        disabled={loading || uploading}
        uploading={uploading}
      />
    </div>
  );
}

export default Chat;
