import { useChat } from "@/contexts/ChatContext";
import { apiService, Message } from "@/services/api";
import { useState } from "react";

const ChatPopup = () => {
  const { isOpen, activeSwapId, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim() || !activeSwapId) return;

    const newMessage = await apiService.sendMessage(
      activeSwapId,
      text.trim()
    );

    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
      setText(""); // clear input
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white shadow-xl rounded-lg flex flex-col z-50">

      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b">
        <span className="font-semibold">Chat</span>
        <button onClick={closeChat}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(msg => (
          <div key={msg._id} className="text-sm">
            <strong>{msg.sender.name}: </strong>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input + Send */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatPopup;