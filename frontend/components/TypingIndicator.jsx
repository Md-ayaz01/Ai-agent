"use client";
import { useEffect, useState } from "react";

export default function TypingIndicator() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="typing-indicator my-2">
      <span className="glow">AI is typing{dots}</span>
    </div>
  );
}
