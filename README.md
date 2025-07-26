README.md Content
markdown
Copy
Edit
# AI Agent Chatbot

An interactive AI chatbot built with **Next.js**, **React**, and **Bootstrap**, featuring chat session management, local storage, and a simulated typing animation for AI responses.

---

## Features
- 🤖 **AI Assistant** – Responds to user queries using a backend API (`CHAT_STREAM`).
- 💬 **Chat Sessions** – Multiple conversations stored in `localStorage`.
- ✍ **Typing Animation** – Realistic AI typing response simulation.
- 📜 **Chat History** – Persistent chat history accessible via sidebar.
- 🎨 **Modern UI** – Bootstrap 5 and Icons for a clean, responsive interface.
- 🌙 **Theme Manager** – Optional dark/light theme toggle.

---

## Tech Stack
- **Frontend:** Next.js, React, Bootstrap 5
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
- **Storage:** LocalStorage for saving chat sessions
- **API:** AI responses fetched via `CHAT_STREAM` endpoint

---

## Project Structure
/components
├── ChatWindow.jsx # Main chat interface
├── Sidebar.jsx # Sidebar for chat sessions
├── MessageBubble.jsx # UI for user/AI messages
├── TypingIndicator.jsx # AI typing animation
├── ThemeManager.jsx # Theme toggler
/lib
└── api.js # API endpoints
/pages
└── index.js # Main page
/public
└── ... # Static assets

yaml
Copy
Edit

---

## Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Md-ayaz01/Ai-agent.git
   cd Ai-agent
Install dependencies

bash
Copy
Edit
npm install
Run the development server

bash
Copy
Edit
npm run dev
Open in browser

arduino
Copy
Edit
http://localhost:3000
Usage
Click "New Chat" in the sidebar to start a conversation.

Type a message and press Enter or Send.

View saved chats on the sidebar.

Future Enhancements
Integration with OpenAI API for real AI responses.

User authentication and cloud storage for chat history.

Export chat sessions to PDF.

