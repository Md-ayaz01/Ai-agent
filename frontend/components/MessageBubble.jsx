"use client";
import { motion } from "framer-motion";

export default function MessageBubble({ role, content, time }) {
  const isUser = role === "user";

  return (
    <motion.div
      className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          className="avatar bg-primary text-white me-2 d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: "35px", height: "35px", fontSize: "1rem" }}
        >
          <i className="bi bi-robot"></i>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`bubble px-3 py-2 rounded-3 position-relative ${isUser ? "bubble-user bg-primary text-white" : "bubble-ai bg-light border"}`}
        style={{ maxWidth: "75%", wordBreak: "break-word" }}
      >
        <div>{content}</div>
        {time && (
          <small
            className={`d-block text-end mt-1 ${isUser ? "text-light opacity-75" : "text-muted"}`}
            style={{ fontSize: "0.7rem" }}
          >
            {time}
          </small>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className="avatar bg-secondary text-white ms-2 d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: "35px", height: "35px", fontSize: "1rem" }}
        >
          <i className="bi bi-person"></i>
        </div>
      )}
    </motion.div>
  );
}
