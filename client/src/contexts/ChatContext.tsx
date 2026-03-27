import { createContext, useContext, useState } from "react";

type ChatContextType = {
  isOpen: boolean;
  activeSwapId: string | null;
  receiverName: string | null;
  openChat: (swapId: string, receiverName?: string) => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSwapId, setActiveSwapId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string | null>(null);

  const openChat = (swapId: string, name?: string) => {
    setActiveSwapId(swapId);
    setReceiverName(name || "Chat");
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setActiveSwapId(null);
    setReceiverName(null);
  };

  return (
    <ChatContext.Provider value={{ isOpen, activeSwapId, receiverName, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
