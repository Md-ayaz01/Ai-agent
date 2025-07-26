"use client";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { CHAT_STREAM } from "@/lib/api";

export default function ChatWindow({ currentChatId, sharedChat = null }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load messages when currentChatId changes
  useEffect(() => {
    if (sharedChat) {
      setMessages(sharedChat);
      return;
    }
    const allChats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    const current = allChats.find((c) => c.id === currentChatId);
    setMessages(current ? current.messages : []);
  }, [currentChatId, sharedChat]);

  // Helper to update chat in localStorage
  const updateChatInLocalStorage = (updatedMessages) => {
    if (sharedChat) return;
    const allChats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    const updatedChats = allChats.map((c) =>
      c.id === currentChatId ? { ...c, messages: updatedMessages } : c
    );
    localStorage.setItem("chat_sessions", JSON.stringify(updatedChats));
    window.dispatchEvent(new Event("storage")); // Sync sidebar
  };

  // Save messages whenever messages state changes
  useEffect(() => {
    updateChatInLocalStorage(messages);
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message (real-time streaming)
  const sendMessage = async (customInput = null) => {
    const text = customInput ?? input;
    if (!text.trim() || sharedChat) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", content: text, time: timestamp };

    // Add user message
    setMessages((m) => {
      const updated = [...m, userMsg];
      updateChatInLocalStorage(updated);
      return updated;
    });

    // Clear input & show loading
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(CHAT_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.content }),
      });

      if (!response.ok) throw new Error("Failed to connect to server");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botContent = "";
      const botMsg = { role: "assistant", content: "", time: timestamp };
      setMessages((m) => [...m, botMsg]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botContent += chunk;

        // Update last message in real-time
        setMessages((m) => {
          const updated = [...m];
          updated[updated.length - 1] = { ...botMsg, content: botContent };
          updateChatInLocalStorage(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ AI is not responding.", time: timestamp },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    updateChatInLocalStorage([]);
  };

  return (
    <div className="chat-window card shadow-lg border-0 rounded-4 p-3 bg-light">
      {/* Header */}
      <div className="chat-header d-flex justify-content-between align-items-center p-2 mb-2 border-bottom">
        <h5 className="m-0"><i className="bi bi-robot"></i> AYAZ AI Assistant</h5>
        {!sharedChat && (
          <button className="btn btn-sm btn-outline-danger" onClick={resetConversation}>
            <i className="bi bi-trash"></i> Reset
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="chat-body position-relative" style={{ maxHeight: "65vh", overflowY: "auto", padding: "0.5rem" }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} time={msg.time} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Box */}
      {!sharedChat && (
        <div className="chat-input d-flex mt-3 flex-column">
          <div className="d-flex">
            <input
              className="form-control me-2"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
