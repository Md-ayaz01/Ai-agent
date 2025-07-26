import os
from dotenv import load_dotenv

load_dotenv()

# You can add any configuration variables here
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
