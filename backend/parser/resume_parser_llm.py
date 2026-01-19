import json
from parser.llm_client import call_ollama
from pydantic import ValidationError
from parser.schemas import ResumeJSON
from parser.loaders import load_resume
from parser.utils import extract_json
import time
import os

def build_prompt(md_text: str) -> str:
    return f"""
You are a resume parser. Your job is to parse resumes written in Markdown format into structured JSON according to the following instructions.

TASK:
Parse the Markdown resume content and return a JSON object.

STRICT REQUIREMENTS:
- Output MUST be valid JSON only. No extra text.
- Extract all sections of resume. Example: Contact Information, Skills, Experience, Education, Projects, Certifications, etc.

RULES:
- Use Markdown headings (e.g. #, ##) to infer sections and subsections.
- If a section has no clear subsections, create exactly one subsection:
  {{
    "title": "<section_name>",
    "data": [...]
  }}
- Preserve all information.
- Include email id and phone number in "Contact Information" section.
- If content does not fit a section, create section_name="OTHER".

RESUME MARKDOWN:
<<<
{md_text}
>>>
""".strip()


def main(file_path: str, output_path: str = "resume_parsed.json"):
    """
    Parse resume and save to specified output path
    
    Args:
        file_path: Path to resume file
        output_path: Path where to save parsed JSON (default: resume_parsed.json)
    
    Returns:
        Path to the saved JSON file
    """
    print(f"📄 Loading resume from: {file_path}")
    md_text = load_resume(file_path)

    print("📝 Extracted Resume Text (first 500 chars):")
    print(md_text[:500] + "...")

    prompt = build_prompt(md_text)

    print("📨 Calling Ollama LLM...")
    response = call_ollama(prompt=prompt)

    print("🧾 Raw LLM output (first 500 chars):")
    print(response[:500] + "...")

    print("\n✅ Parsing JSON...")
    parsed = extract_json(response)

    print("✅ Validating JSON with Pydantic schema...")
    try:
        validated = ResumeJSON.model_validate(parsed)
    except ValidationError as e:
        print("\n❌ Output JSON did not match schema.")
        print(e)
        raise

    # Save to specified output path
    print(f"💾 Saving parsed resume to: {output_path}")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(validated.model_dump(), f, indent=2, ensure_ascii=False)

    print(f"\n🎉 Done. Saved: {output_path}")
    
    # Verify file exists
    if not os.path.exists(output_path):
        raise Exception(f"Failed to create output file: {output_path}")
    
    return output_path


if __name__ == "__main__":
    start_time = time.time()
    main("resume.pdf")
    end_time = time.time()
    print(f"\n⏱️ Total time taken: {end_time - start_time:.2f} seconds")