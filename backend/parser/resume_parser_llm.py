import json
from parser.llm_client import call_ollama
from pydantic import ValidationError
from parser.schemas import ResumeJSON
from parser.loaders import load_resume
from parser.utils import extract_json
import time
import os

# def build_prompt(md_text: str) -> str:
#     return f"""
# You are a resume parser. Your job is to parse resumes written in Markdown format into structured JSON according to the following instructions.

# TASK:
# Parse the Markdown resume content and return a JSON object.

# STRICT REQUIREMENTS:
# - Output MUST be valid JSON only. No extra text.
# - Extract all sections of resume. Example: Contact Information, Skills, Experience, Education, Projects, Certifications, etc.

# RULES:
# - Use Markdown headings (e.g. #, ##) to infer sections and subsections.
# - If a section has no clear subsections, create exactly one subsection:
#   {{
#     "title": "<section_name>",
#     "data": [...]
#   }}
# - Preserve all information.
# - Include name in a seperte section called "Name".
# - Include email id, phone number etc in "Contact Information" section.
# - Include github, linkedin etc in "Links" section.
# - Include skills in "Skills" section.
# - Include work experience in "Experience" section, with each job as a separate entry.
# - Other sections should be created as per the content. For example, if there is an "Education" section, create it with relevant details.
# - Example of other sections: "Projects", "Certifications", "Awards", "Publications", "Languages", "Interests", etc.
# - If content does not fit a section, create section_name="OTHER".

# Example Format:


# RESUME MARKDOWN:
# <<<
# {md_text}
# >>>
# """.strip()

def build_prompt(md_text: str) -> str:
    return f"""You are a resume parsing assistant.

Your task is to extract structured information from a resume written in Markdown format and convert it into a clean JSON object.

Instructions:
1. Extract only information that is explicitly present. Do NOT infer or hallucinate missing data.
2. Preserve original vocabulary and phrasing. Do NOT rephrase or summarize. Use the exact words from the resume.
3. Remove Markdown symbols (**, _, links, bullets, etc.).
4. Convert dates into the format:
   - Month Year (e.g., "July 2025")
   - If present → use: start_date and end_date
   - If ongoing → end_date = "Present"
5. Extract bullet points as a list of strings.
6. Extract skills mentioned within sections and also maintain a global unique skills list.
7. If a field is missing, do not include it. Do not make up data.
8. For links included in sections 
8. Return ONLY valid JSON. No explanation, no extra text.

Output JSON schema:

{{
  "name": {{
    "Name": string
  }},

  "contact_information": {{
    "Email": string | null,
    "Phone Number": string | null,
    "Location": string | null
  }},

  "links": {{
    "LinkedIn": string | null,
    "GitHub": string | null,
    "Portfolio": string | null,
    "Personal Website": string | null
  }},

  "Summary": string | null,

  "Work Experience": [
    {{
      "Job Title": string,
      "Company Name": string,
      "Company URL": string | null,
      "Location": string | null,
      "Start Date": string | null,
      "End Date": string | null,
      "Skills": [string],
      "Responsibilities": [string]
    }}
  ],

  "Education": [
    {{
      "Degree": string,
      "Field of Study": string | null,
      "Institution Name": string,
      "Location": string | null,
      "Start Date": string | null,
      "End Date": string | null,
      "Grade": string | null
    }}
  ],

  "Projects": [
    {{
      "Name": string,
      "Description": string,
      "Skills": [string],
      "URL": string | null
    }}
  ],

  "Certifications": [
    {{
      "Name": string,
      "Issuer": string | null,
      "Date": string | null
    }}
  ],

  "Skills": [string]
}}

Extraction Rules:
- Clean company names by removing emojis or special characters.
- Extract links from Markdown format: [text](url).
- Bullet symbols such as "-", "*", "◦" should be converted into plain text items.
- Skills listed in lines like:
  "Skills: Python, AWS, Docker"
  should be split into individual items.
- Combine all detected skills into the top-level "skills" list (unique values).
- If multiple roles exist at the same company, create separate entries.
- Maintain the order of experiences as they appear.

Input Markdown Resume:
-----------------------
{md_text}
-----------------------

Return ONLY the JSON.
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
    main("/Users/behera5/Desktop/project-thunder/backend/parser/resume.pdf")
    end_time = time.time()
    print(f"\n⏱️ Total time taken: {end_time - start_time:.2f} seconds")