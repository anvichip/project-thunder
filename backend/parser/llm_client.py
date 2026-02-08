import requests
from typing import Type
from pydantic import BaseModel

def call_ollama(prompt: str, format_model: Type[BaseModel]) -> str:
    model = "llama3.2"
    url = "http://localhost:11434/api/generate" #TODO: Change according to EC2 setup

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0
        },
        "format": format_model.model_json_schema()
    }

    resp = requests.post(url, json=payload, timeout=500)
    resp.raise_for_status()
    return resp.json()["response"]