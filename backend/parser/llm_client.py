import requests
from parser.schemas import ResumeJSON

def call_ollama(prompt: str) -> str:
    model = "llama3.1"
    url = "http://localhost:11434/api/generate" #TODO: Change according to EC2 setup

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0
        },
        "format": ResumeJSON.model_json_schema() #TODO: Fast the parsing
    }

    resp = requests.post(url, json=payload, timeout=300)
    resp.raise_for_status()
    return resp.json()["response"]