import json 

def extract_json(text: str) -> dict:
    """
    This is intentionally strict:
    expects the LLM to output pure JSON.
    """
    print("Extracting JSON...")

    import re
    match = re.search(r"```(?:\w+)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()
    else:
        print("No ``` block found")
    
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as e:
        print("JSONDecodeError:", e)
        print("Near:", repr(text[e.pos-40:e.pos+40]))
        raise

    return parsed