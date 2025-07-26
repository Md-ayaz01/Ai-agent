"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Sidebar({ currentChatId, setCurrentChatId }) {
  const [chats, setChats] = useState([]);

  // Load chats initially
  const loadChats = () => {
    const savedChats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    setChats(savedChats);
  };

  useEffect(() => {
    loadChats();
    // Listen for changes from ChatWindow
    const handleStorageChange = () => loadChats();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save chats
  const saveChats = (newChats) => {
    setChats(newChats);
    localStorage.setItem("chat_sessions", JSON.stringify(newChats));
    window.dispatchEvent(new Event("storage")); // notify ChatWindow
  };

  // Create new chat
  const createNewChat = () => {
    const newChat = { id: uuidv4(), title: "New Chat", messages: [] };
    const updated = [newChat, ...chats];
    saveChats(updated);
    setCurrentChatId(newChat.id);
  };

  // Delete chat
  const deleteChat = (chatId) => {
    const updatedChats = chats.filter((c) => c.id !== chatId);
    saveChats(updatedChats);
    if (currentChatId === chatId && updatedChats.length > 0) {
      setCurrentChatId(updatedChats[0].id);
    } else if (updatedChats.length === 0) {
      setCurrentChatId(null);
    }
  };

  return (
    <div className="d-flex flex-column bg-dark text-light vh-100 p-3" style={{ width: "250px" }}>
      <h4 className="mb-4 text-center">
        <i className="bi bi-chat-dots"></i> AI Chat
      </h4>

      <button className="btn btn-primary mb-3" onClick={createNewChat}>
        <i className="bi bi-plus-circle"></i> New Chat
      </button>

      <div className="flex-grow-1 overflow-auto">
        {chats.length === 0 && <p className="text-muted text-center">No chat history</p>}
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`d-flex justify-content-between align-items-center p-2 mb-2 rounded ${
              currentChatId === chat.id ? "bg-primary text-white" : "bg-secondary"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentChatId(chat.id)}
          >
            <span className="text-truncate" style={{ maxWidth: "160px" }}>
              {chat.title}
            </span>
            <i
              className="bi bi-trash text-danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            ></i>
          </div>
        ))}
      </div>
    </div>
  );
}
