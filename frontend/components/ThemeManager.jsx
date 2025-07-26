"use client";
import { useState, useEffect } from "react";

export default function ThemeManager() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const themes = ["dark", "blue", "orange"];

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      className="theme-toggle-btn btn btn-outline-light"
      onClick={nextTheme}
    >
      <i className="bi bi-palette"></i> {theme.toUpperCase()} MODE
    </button>
  );
}
