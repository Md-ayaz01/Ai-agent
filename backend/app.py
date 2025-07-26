from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import chat_router

app = FastAPI(title="AI Agent Backend")

# Allow requests from your frontend Render domain
origins = [
    "https://ai-agent-frontend-6fld.onrender.com/",  # Replace with your actual frontend Render URL
    "http://localhost:3000",                   # For local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/")
def home():
    return {"message": "AI Agent Backend Running 🚀"}
