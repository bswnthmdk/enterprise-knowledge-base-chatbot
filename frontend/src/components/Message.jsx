function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? "rounded-2xl rounded-br-md bg-[#292724] text-white"
            : "rounded-2xl rounded-bl-md bg-[#ebe7e1] text-[#37332e]"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default Message;
