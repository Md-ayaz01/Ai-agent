import subprocess

OLLAMA_PATH = r"C:\Users\patha\AppData\Local\Programs\Ollama\ollama.exe"

def stream_ollama(model: str, prompt: str):
    try:
        cmd = [OLLAMA_PATH, "run", model]
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        process.stdin.write(prompt)
        process.stdin.close()

        for line in iter(process.stdout.readline, ''):
            yield line.strip()
        process.stdout.close()
        process.wait()
    except Exception as e:
        yield f"Error: {e}"
