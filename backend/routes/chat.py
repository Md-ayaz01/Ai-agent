from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agent.agent import run_agent_stream

chat_router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

@chat_router.post("/chat/stream")
def chat_stream(req: ChatRequest):
    generator = run_agent_stream(req.prompt)
    return StreamingResponse(generator, media_type="text/plain")
