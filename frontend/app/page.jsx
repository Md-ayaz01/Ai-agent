"use client";
import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";

export default function Page() {
  const [currentChatId, setCurrentChatId] = useState("");

  useEffect(() => {
    // This runs only in the browser
    const chats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    if (chats.length > 0) {
      setCurrentChatId(chats[chats.length - 1].id);
    } else {
      const newChat = { id: Date.now().toString(), title: "New Chat", messages: [] };
      localStorage.setItem("chat_sessions", JSON.stringify([newChat]));
      setCurrentChatId(newChat.id);
    }
  }, []);

  return <ChatWindow currentChatId={currentChatId} />;
}
