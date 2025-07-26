from .ollama_client import stream_ollama

MODEL = "llama3"

def run_agent_stream(prompt: str):
    return stream_ollama(MODEL, prompt)
