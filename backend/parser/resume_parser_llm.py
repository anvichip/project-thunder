
import json
from parser.llm_client import call_ollama
from pydantic import ValidationError
from parser.schemas import ResumeJSON
from parser.loaders import load_resume
from parser.utils import extract_json

def build_prompt(md_text: str) -> str:
    return f"""
You are a resume parser.

TASK:
Parse the Markdown resume content and return a JSON object.

STRICT REQUIREMENTS:
- Output MUST be valid JSON only. No extra text.
- Use this exact structure:
- Return the JSON object wrapper in ``` backticks.

Example output:
{{
  "sections": [
    {{
      "section_name": "SECTION TITLE",
      "subsections": [
        {{
          "title": "Subsection title",
          "data": [
            "bullet or line 1",
            "bullet or line 2"
          ]
        }}
      ]
    }}
  ]
}}

RULES:
- Use Markdown headings (e.g. #, ##) to infer sections and subsections.
- If a section has no clear subsections, create exactly one subsection:
  {{
    "title": "<section_name>",
    "data": [...]
  }}
- Preserve all important lines.
- Do NOT hallucinate.
- If content does not fit a section, create section_name="OTHER".

RESUME MARKDOWN:
<<<
{md_text}
>>>
""".strip()


def main(file_path: str):   
    md_text = load_resume(file_path)

    print("Extracted Resume Text:")
    print(md_text)

    prompt = build_prompt(md_text)

    print("📨 Calling Ollama...")
    response = call_ollama(prompt=prompt)

    print("🧾 Raw LLM output:")
    print(response)

    print("\n✅ Parsing JSON...")
    parsed = extract_json(response)

    print("✅ Validating JSON with pedantic schema (Pydantic)...")
    try:
        validated = ResumeJSON.model_validate(parsed)
    except ValidationError as e:
        print("\n❌ Output JSON did not match schema.")
        print(e)
        raise

    #TODO: Modification needed according to front-end requirements
    out_path = "resume_parsed.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(validated.model_dump(), f, indent=2, ensure_ascii=False)

    print(f"\n🎉 Done. Saved: {out_path}")


# if __name__ == "__main__":
#     main("/Users/kohli1/thunder/project-thunder/backend/work_resume_sample.docx")
