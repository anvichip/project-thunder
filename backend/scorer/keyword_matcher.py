from pydantic import BaseModel
from typing import List
from parser.llm_client import call_ollama

class JDSkills(BaseModel):
    skills: List[str]

def extract_skills_from_jd(jd_text: str):
    """Uses Ollama to extract a clean list of skills from a JD."""
    
    prompt = f"""
    Extract a list of technical skills, tools, and keywords from the following Job Description.
    Return ONLY a JSON object with a single key 'skills' containing a list of strings.
    
    Job Description:
    {jd_text}
    """
    try:
        response = call_ollama(prompt=prompt, format_model=JDSkills)
        
        # Parse response
        # raw_data = response.json().get("response", "{}")
        extracted = JDSkills.model_validate_json(response)
        return [skill.lower() for skill in extracted.skills]
    except Exception as e:
        print(f"Error calling Ollama: {e}")
        return []

def compare_skills(candidate_skills: List[str], jd_skills: List[str]):
    """Compares candidate skills against JD requirements."""
    candidate_set = set(s.lower() for s in candidate_skills)
    jd_set = set(jd_skills)
    
    matched = candidate_set.intersection(jd_set)
    missing = jd_set - candidate_set
    
    return {
        "matched": list(matched),
        "missing": list(missing),
        "match_percentage": round((len(matched) / len(jd_set)) * 100, 2) if jd_set else 0
    }

# --- Example Usage ---
# if __name__ == "__main__":
#     job_description = """
#     We are looking for a Backend Engineer proficient in Python and Go. 
#     Experience with AWS Bedrock, PostgreSQL, and FastAPI is required. 
#     Knowledge of RAG systems and LLM fine-tuning is a plus.
#     """
    
#     # Example skills for the candidate
#     my_skills = ["Python", "Go", "PostgreSQL", "Docker", "AWS S3", "LLM fine-tuning"]

#     print("Extracting skills from JD...")
#     extracted_jd_skills = extract_skills_from_jd(job_description)
    
#     if extracted_jd_skills:
#         print(f"Extracted JD Skills: {extracted_jd_skills}")
        
#         results = compare_skills(my_skills, extracted_jd_skills)
        
#         print("\n--- Skill Comparison ---")
#         print(f"✅ Matched: {results['matched']}")
#         print(f"❌ Missing: {results['missing']}")
#         print(f"📊 Match Score: {results['match_percentage']}%")