"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeManager from "@/components/ThemeManager";
import ChatWindow from "@/components/ChatWindow";

export default function RootLayout() {
  const [currentChatId, setCurrentChatId] = useState("");

  // Ensure a chat session exists
  const ensureChatSession = () => {
    const allChats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    if (allChats.length > 0) {
      setCurrentChatId(allChats[allChats.length - 1].id);
    } else {
      const newChat = { id: crypto.randomUUID(), title: "New Chat", messages: [] };
      localStorage.setItem("chat_sessions", JSON.stringify([newChat]));
      setCurrentChatId(newChat.id);
    }
  };

  useEffect(() => {
    ensureChatSession();
  }, []);

  return (
    <html lang="en">
      <body className="bg-light text-dark">
        <div className="d-flex vh-100">
          {/* Sidebar */}
          <div className="bg-dark text-light d-flex flex-column" style={{ width: "260px" }}>
            <Sidebar currentChatId={currentChatId} setCurrentChatId={setCurrentChatId} />
            <div className="mt-auto p-2 border-top">
              <ThemeManager />
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-grow-1 d-flex flex-column">
            <div className="flex-grow-1 overflow-auto p-3">
              {currentChatId ? (
                <ChatWindow key={currentChatId} currentChatId={currentChatId} />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <p className="text-muted">Select or create a chat to start</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
