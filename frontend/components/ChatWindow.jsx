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

    // Notify other components like Sidebar
    window.dispatchEvent(new Event("storage"));
  };

  // Save messages whenever messages state changes
  useEffect(() => {
    updateChatInLocalStorage(messages);
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Typing animation
  const typeMessage = (finalText, botMsg) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < finalText.length) {
        botMsg.content += finalText[index];
        setMessages((m) => {
          const updated = [...m.slice(0, -1), { ...botMsg }];
          updateChatInLocalStorage(updated);
          return updated;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);
  };

  // Send message
  const sendMessage = async (customInput = null) => {
    const text = customInput ?? input;
    if (!text.trim() || sharedChat) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", content: text, time: timestamp };
    setMessages((m) => {
      const updated = [...m, userMsg];
      updateChatInLocalStorage(updated);

      // Update chat title on first message
      const allChats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
      const chatIndex = allChats.findIndex((c) => c.id === currentChatId);
      if (chatIndex !== -1 && allChats[chatIndex].title === "New Chat") {
        allChats[chatIndex].title = text.slice(0, 25) + (text.length > 25 ? "..." : "");
        localStorage.setItem("chat_sessions", JSON.stringify(allChats));
        window.dispatchEvent(new Event("storage"));
      }

      return updated;
    });

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(CHAT_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.content }),
      });

      if (!response.ok) throw new Error("Failed to connect to server");

      let botMsg = { role: "assistant", content: "", time: timestamp };
      setMessages((m) => {
        const updated = [...m, botMsg];
        updateChatInLocalStorage(updated);
        return updated;
      });

      let finalText = "";
      if (response.body && response.body.getReader) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          finalText += decoder.decode(value, { stream: true });
        }
      } else {
        const data = await response.json();
        finalText = data.reply || "No response from AI.";
      }

      typeMessage(finalText, botMsg);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((m) => {
        const updated = [...m, { role: "assistant", content: "⚠️ AI is not responding.", time: timestamp }];
        updateChatInLocalStorage(updated);
        return updated;
      });
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
      <div className="chat-header d-flex justify-content-between align-items-center p-2 mb-2 border-bottom">
        <h5 className="m-0"><i className="bi bi-robot"></i> AYAZ AI Assistant</h5>
        {!sharedChat && (
          <button className="btn btn-sm btn-outline-danger" onClick={resetConversation}>
            <i className="bi bi-trash"></i> Reset
          </button>
        )}
      </div>

      <div className="chat-body position-relative" style={{ maxHeight: "65vh", overflowY: "auto", padding: "0.5rem" }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} time={msg.time} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef}></div>
      </div>

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
