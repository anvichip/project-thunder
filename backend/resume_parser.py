import PyPDF2
import re
from typing import Dict, Optional

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def extract_email(text: str) -> Optional[str]:
    """Extract email address from text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else None

def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text"""
    phone_patterns = [
        r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\+\d{10,15}'
    ]
    
    for pattern in phone_patterns:
        phones = re.findall(pattern, text)
        if phones:
            return phones[0]
    return None

def extract_linkedin(text: str) -> Optional[str]:
    """Extract LinkedIn URL from text"""
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
    links = re.findall(linkedin_pattern, text, re.IGNORECASE)
    return links[0] if links else None

def extract_github(text: str) -> Optional[str]:
    """Extract GitHub URL from text"""
    github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+'
    links = re.findall(github_pattern, text, re.IGNORECASE)
    return links[0] if links else None

def extract_name(text: str) -> Optional[str]:
    """Extract name from text (assumes name is at the beginning)"""
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if line and len(line.split()) <= 4 and len(line) > 3:
            # Basic name validation
            if not any(char.isdigit() for char in line) and not '@' in line:
                return line
    return None

def extract_skills(text: str) -> str:
    """Extract skills section from text"""
    skills_keywords = ['skills', 'technical skills', 'core competencies', 'expertise']
    lines = text.split('\n')
    
    skills_section = []
    capture = False
    
    for i, line in enumerate(lines):
        line_lower = line.lower().strip()
        
        # Check if this line is a skills header
        if any(keyword in line_lower for keyword in skills_keywords):
            capture = True
            continue
        
        # Stop capturing if we hit another section
        if capture and line_lower and any(header in line_lower for header in 
            ['experience', 'education', 'projects', 'certifications', 'work history']):
            break
        
        # Capture skills
        if capture and line.strip():
            skills_section.append(line.strip())
    
    return ', '.join(skills_section[:10]) if skills_section else ""

def extract_experience(text: str) -> str:
    """Extract work experience section from text"""
    experience_keywords = ['experience', 'work experience', 'employment', 'work history', 'professional experience']
    lines = text.split('\n')
    
    experience_section = []
    capture = False
    
    for line in lines:
        line_lower = line.lower().strip()
        
        # Check if this line is an experience header
        if any(keyword in line_lower for keyword in experience_keywords):
            capture = True
            continue
        
        # Stop capturing if we hit another major section
        if capture and line_lower and any(header in line_lower for header in 
            ['education', 'skills', 'projects', 'certifications']):
            break
        
        # Capture experience
        if capture and line.strip():
            experience_section.append(line.strip())
    
    return '\n'.join(experience_section[:20]) if experience_section else ""

def extract_education(text: str) -> str:
    """Extract education section from text"""
    education_keywords = ['education', 'academic', 'qualification']
    lines = text.split('\n')
    
    education_section = []
    capture = False
    
    for line in lines:
        line_lower = line.lower().strip()
        
        # Check if this line is an education header
        if any(keyword in line_lower for keyword in education_keywords):
            capture = True
            continue
        
        # Stop capturing if we hit another major section
        if capture and line_lower and any(header in line_lower for header in 
            ['experience', 'skills', 'projects', 'certifications']):
            break
        
        # Capture education
        if capture and line.strip():
            education_section.append(line.strip())
    
    return '\n'.join(education_section[:10]) if education_section else ""

def parse_resume(pdf_path: str) -> Dict[str, Optional[str]]:
    """
    Main function to parse resume and extract all relevant information
    
    Args:
        pdf_path: Path to the PDF resume file
        
    Returns:
        Dictionary containing extracted information
    """
    try:
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_path)
        
        # Extract all fields
        extracted_data = {
            "fullName": extract_name(text) or "",
            "email": extract_email(text) or "",
            "phone": extract_phone(text) or "",
            "linkedin": extract_linkedin(text) or "",
            "github": extract_github(text) or "",
            "skills": extract_skills(text) or "",
            "experience": extract_experience(text) or "",
            "education": extract_education(text) or ""
        }
        
        return extracted_data
        
    except Exception as e:
        raise Exception(f"Error parsing resume: {str(e)}")