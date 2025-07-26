"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="btn btn-outline-light w-100"
      onClick={() => setDark(!dark)}
    >
      {dark ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
    </button>
  );
}
