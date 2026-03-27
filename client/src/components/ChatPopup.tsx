import { useChat } from "@/contexts/ChatContext";
import { apiService, Message } from "@/services/api";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { Send } from "lucide-react";

const ChatPopup = () => {
  const { isOpen, activeSwapId, receiverName, closeChat } = useChat();
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Close chat automatically if logged out
  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      closeChat();
    }
  }, [isAuthenticated, isOpen, closeChat]);

  useEffect(() => {
    if (!isOpen || !activeSwapId) return;

    // Load initial messages
    apiService.getMessagesBySwapId(activeSwapId).then(setMessages);

    // Bind WebSocket
    const socket: Socket = io("https://skillverse-nakl.onrender.com", {
      withCredentials: true,
    });

    socket.emit("joinChat", activeSwapId);

    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => {
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [isOpen, activeSwapId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !activeSwapId) return;

    const savedText = text.trim();
    setText(""); // clear input instantly for smooth UX

    await apiService.sendMessage(
      activeSwapId,
      savedText
    );
    // Note: Do not manually setMessages here, the WebSocket `newMessage` event will push the message back securely!
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto w-auto sm:w-96 h-[500px] max-h-[calc(100vh-2rem)] bg-background border border-border shadow-2xl rounded-lg flex flex-col z-50">

      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b bg-muted/30">
        <span className="font-semibold">{receiverName || "Chat"}</span>
        <button onClick={closeChat} className="text-muted-foreground hover:text-foreground">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const currentUserId = user?._id || user?.id;
          const senderId = msg.sender?._id || msg.sender?.id;
          const isMe = currentUserId && senderId && String(currentUserId) === String(senderId);
          return (
            <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-muted-foreground mb-1">{isMe ? 'You' : msg.sender.name}</span>
              <div className={`p-2 rounded-lg text-sm max-w-[85%] ${
                isMe 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border border-border'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
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
          className="flex-1 border border-border bg-background rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex items-center justify-center h-10 w-10 shrink-0 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-colors hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};

export default ChatPopup;