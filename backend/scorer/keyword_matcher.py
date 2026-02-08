# backend/scorer/keyword_matcher.py
from pydantic import BaseModel
from typing import List, Dict, Any
from parser.llm_client import call_ollama
import re

class JDSkills(BaseModel):
    skills: List[str]

class ResumeSkills(BaseModel):
    skills: List[str]

class Recommendations(BaseModel):
    missing_keywords: List[str]
    matching_strengths: List[str]
    suggested_actions: List[str]

def extract_skills_from_jd(jd_text: str) -> List[str]:
    """Uses Ollama to extract a clean list of skills from a JD."""
    
    prompt = f"""
    Extract a comprehensive list of technical skills, tools, technologies, frameworks, programming languages, 
    certifications, and important keywords from the following Job Description.
    
    Include:
    - Programming languages (Python, Java, JavaScript, etc.)
    - Frameworks and libraries (React, Django, TensorFlow, etc.)
    - Tools and platforms (AWS, Docker, Kubernetes, Git, etc.)
    - Databases (PostgreSQL, MongoDB, MySQL, etc.)
    - Methodologies (Agile, Scrum, CI/CD, etc.)
    - Soft skills if explicitly mentioned as requirements
    - Domain-specific knowledge
    
    Return ONLY a JSON object with a single key 'skills' containing a list of strings.
    Each skill should be normalized (e.g., "AWS" not "Amazon Web Services", "ML" can be "Machine Learning").
    
    Job Description:
    {jd_text}
    
    Example response format:
    {{"skills": ["Python", "AWS", "Docker", "Machine Learning", "REST APIs"]}}
    """
    
    try:
        print("🤖 Calling Ollama to extract JD skills...")
        response = call_ollama(prompt=prompt, format_model=JDSkills)
        extracted = JDSkills.model_validate_json(response)
        
        # Normalize skills to lowercase for comparison
        normalized_skills = [skill.strip().lower() for skill in extracted.skills if skill.strip()]
        
        print(f"✅ Extracted {len(normalized_skills)} skills from JD")
        return normalized_skills
        
    except Exception as e:
        print(f"❌ Error extracting JD skills: {e}")
        # Fallback: simple keyword extraction
        return fallback_skill_extraction(jd_text)

def extract_skills_from_text(resume_text: str) -> List[str]:
    """Uses Ollama to extract skills from resume text."""
    
    prompt = f"""
    Extract a comprehensive list of technical skills, tools, technologies, frameworks, programming languages,
    and competencies from the following resume text.
    
    Include:
    - Programming languages
    - Frameworks and libraries
    - Tools and platforms
    - Databases
    - Methodologies
    - Domain expertise
    - Certifications
    
    Return ONLY a JSON object with a single key 'skills' containing a list of strings.
    Be thorough and extract all mentioned technologies and skills.
    
    Resume Text:
    {resume_text}
    
    Example response format:
    {{"skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Machine Learning"]}}
    """
    
    try:
        print("🤖 Calling Ollama to extract resume skills...")
        response = call_ollama(prompt=prompt, format_model=ResumeSkills)
        extracted = ResumeSkills.model_validate_json(response)
        
        # Normalize skills to lowercase
        normalized_skills = [skill.strip().lower() for skill in extracted.skills if skill.strip()]
        
        print(f"✅ Extracted {len(normalized_skills)} skills from resume")
        return normalized_skills
        
    except Exception as e:
        print(f"❌ Error extracting resume skills: {e}")
        # Fallback: simple keyword extraction
        return fallback_skill_extraction(resume_text)

def fallback_skill_extraction(text: str) -> List[str]:
    """Fallback method for skill extraction when LLM fails"""
    # Common technical skills to look for
    common_skills = [
        'python', 'java', 'javascript', 'typescript', 'go', 'rust', 'c++', 'c#',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'fastapi',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
        'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
        'machine learning', 'deep learning', 'nlp', 'computer vision', 'ai',
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
        'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'ci/cd'
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in common_skills:
        if skill in text_lower:
            found_skills.append(skill)
    
    # Also extract capitalized words that might be technologies
    words = re.findall(r'\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b', text)
    found_skills.extend([w.lower() for w in words if len(w) > 2])
    
    return list(set(found_skills))

def compare_skills(candidate_skills: List[str], jd_skills: List[str]) -> Dict[str, Any]:
    """Compares candidate skills against JD requirements with fuzzy matching."""
    
    # Normalize all skills
    candidate_set = set(s.lower().strip() for s in candidate_skills)
    jd_set = set(s.lower().strip() for s in jd_skills)
    
    # Direct matches
    matched = candidate_set.intersection(jd_set)
    
    # Fuzzy matching for partial matches
    fuzzy_matched = set()
    for jd_skill in jd_set:
        if jd_skill not in matched:
            for candidate_skill in candidate_set:
                # Check if one is substring of other (e.g., "react" matches "react.js")
                if (jd_skill in candidate_skill or candidate_skill in jd_skill) and \
                   len(jd_skill) > 2 and len(candidate_skill) > 2:
                    fuzzy_matched.add(jd_skill)
                    matched.add(jd_skill)
                    break
    
    # Calculate missing skills
    missing = jd_set - matched
    
    # Calculate match percentage
    match_percentage = round((len(matched) / len(jd_set)) * 100, 2) if jd_set else 0
    
    result = {
        "matched": sorted(list(matched)),
        "missing": sorted(list(missing)),
        "match_percentage": match_percentage,
        "total_jd_skills": len(jd_set),
        "total_candidate_skills": len(candidate_set),
        "matched_count": len(matched)
    }
    
    print(f"📊 Skill Comparison: {len(matched)}/{len(jd_set)} matched ({match_percentage}%)")
    
    return result

def generate_recommendations(
    jd_text: str,
    matched_skills: List[str],
    missing_skills: List[str],
    resume_text: str
) -> Dict[str, List[str]]:
    """Generate tailored recommendations using LLM"""
    
    prompt = f"""
    Analyze the job description and resume to provide tailored recommendations.
    
    Job Description (excerpt):
    {jd_text[:1000]}
    
    Matched Skills: {', '.join(matched_skills[:15])}
    Missing Skills: {', '.join(missing_skills[:15])}
    
    Resume Text (excerpt):
    {resume_text[:1000]}
    
    Provide specific, actionable recommendations in three categories:
    
    1. missing_keywords: List 3-5 critical missing keywords/skills that should be added to the resume
    2. matching_strengths: List 2-3 specific strengths where the candidate's experience aligns well with the JD
    3. suggested_actions: List 3-5 concrete actions the candidate should take to improve their resume for this role
    
    Be specific and actionable. Reference actual technologies and experiences from the resume.
    
    Return ONLY a JSON object with these three keys as lists of strings.
    
    Example format:
    {{
        "missing_keywords": ["AWS Lambda", "CI/CD pipelines", "Agile methodology"],
        "matching_strengths": ["Strong Python experience aligns with backend requirements", "Docker and Kubernetes experience matches DevOps needs"],
        "suggested_actions": ["Quantify achievements in ML projects with metrics", "Add certifications section if you have AWS certifications", "Emphasize leadership in team projects"]
    }}
    """
    
    try:
        print("💡 Generating recommendations with LLM...")
        response = call_ollama(prompt=prompt, format_model=Recommendations)
        recommendations = Recommendations.model_validate_json(response)
        
        result = {
            "missing_keywords": recommendations.missing_keywords,
            "matching_strengths": recommendations.matching_strengths,
            "suggested_actions": recommendations.suggested_actions
        }
        
        print(f"✅ Generated recommendations: {len(result['suggested_actions'])} actions")
        return result
        
    except Exception as e:
        print(f"❌ Error generating recommendations: {e}")
        # Fallback recommendations
        return {
            "missing_keywords": missing_skills[:5] if missing_skills else ["No missing skills identified"],
            "matching_strengths": [
                f"You have {len(matched_skills)} matching skills with this role",
                "Your technical background aligns with the position requirements"
            ],
            "suggested_actions": [
                "Consider adding the missing keywords to your resume where applicable",
                "Quantify your achievements with specific metrics and numbers",
                "Tailor your resume summary to highlight relevant experience",
                "Add projects that demonstrate the required skills",
                "Consider obtaining certifications in missing skill areas"
            ]
        }

# Example usage for testing
if __name__ == "__main__":
    job_description = """
    We are looking for a Senior Backend Engineer proficient in Python and Go. 
    Experience with AWS services (Lambda, S3, EC2), PostgreSQL, and FastAPI is required. 
    Knowledge of RAG systems, LLM fine-tuning, and vector databases is a plus.
    Must have experience with Docker, Kubernetes, and CI/CD pipelines.
    """
    
    resume_text = """
    Senior Software Engineer with 5 years of experience in Python development.
    Built scalable APIs using FastAPI and Django. Worked extensively with PostgreSQL 
    and MongoDB databases. Experience with Docker containerization and AWS S3 storage.
    Developed machine learning models using TensorFlow and deployed them to production.
    Proficient in Git, GitHub Actions, and Agile methodologies.
    """
    
    print("=" * 80)
    print("JD SKILL MATCHING TEST")
    print("=" * 80)
    
    print("\n1. Extracting skills from JD...")
    jd_skills = extract_skills_from_jd(job_description)
    print(f"   JD Skills: {jd_skills}")
    
    print("\n2. Extracting skills from Resume...")
    candidate_skills = extract_skills_from_text(resume_text)
    print(f"   Resume Skills: {candidate_skills}")
    
    print("\n3. Comparing skills...")
    results = compare_skills(candidate_skills, jd_skills)
    print(f"\n   ✅ Matched ({len(results['matched'])}): {results['matched']}")
    print(f"   ❌ Missing ({len(results['missing'])}): {results['missing']}")
    print(f"   📊 Match Score: {results['match_percentage']}%")
    
    print("\n4. Generating recommendations...")
    recommendations = generate_recommendations(
        jd_text=job_description,
        matched_skills=results['matched'],
        missing_skills=results['missing'],
        resume_text=resume_text
    )
    
    print("\n   💡 Recommendations:")
    print(f"   Missing Keywords: {recommendations['missing_keywords']}")
    print(f"   Matching Strengths: {recommendations['matching_strengths']}")
    print(f"   Suggested Actions: {recommendations['suggested_actions']}")
    
    print("\n" + "=" * 80)