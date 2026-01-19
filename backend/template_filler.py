# template_filler.py - FIXED VERSION
from bs4 import BeautifulSoup
import re
from typing import Dict, Any, List

def fill_html_template(html_template: str, css_template: str, profile_data: Dict[str, Any]) -> str:
    """
    Fill HTML template with profile data - PRESERVING ORIGINAL DESIGN
    
    Args:
        html_template: HTML template string from uploaded resume
        css_template: CSS template string from uploaded resume
        profile_data: Dictionary containing resume sections
        
    Returns:
        Complete HTML document with filled data
    """
    print("🎨 Filling template with profile data...")
    
    try:
        # Parse HTML
        soup = BeautifulSoup(html_template, 'html.parser')
        
        # Extract contact information
        contact_info = extract_contact_info(profile_data)
        print(f"📧 Extracted contact: {contact_info}")
        
        # Find body or create one
        body = soup.find('body')
        if not body:
            body = soup.new_tag('body')
            if soup.html:
                soup.html.append(body)
            else:
                html_tag = soup.new_tag('html')
                soup.append(html_tag)
                html_tag.append(body)
        
        # Clear body content while preserving structure
        body.clear()
        
        # Build new content preserving original structure
        sections_html = create_sections_html(profile_data, contact_info)
        
        # Parse and append sections
        sections_soup = BeautifulSoup(sections_html, 'html.parser')
        for element in sections_soup.children:
            if element.name:  # Skip text nodes
                body.append(element)
        
        # Ensure head exists
        head = soup.find('head')
        if not head:
            head = soup.new_tag('head')
            if soup.html:
                soup.html.insert(0, head)
            else:
                html_tag = soup.find('html')
                if html_tag:
                    html_tag.insert(0, head)
        
        # Add meta charset if not present
        if not head.find('meta', {'charset': True}):
            meta = soup.new_tag('meta')
            meta.attrs['charset'] = 'UTF-8'
            head.insert(0, meta)
        
        # Add viewport meta
        if not head.find('meta', {'name': 'viewport'}):
            viewport = soup.new_tag('meta')
            viewport.attrs['name'] = 'viewport'
            viewport.attrs['content'] = 'width=device-width, initial-scale=1.0'
            head.append(viewport)
        
        # Add CSS (preserving original styles)
        enhanced_css = enhance_css(css_template)
        style_tag = soup.new_tag('style')
        style_tag.string = enhanced_css
        head.append(style_tag)
        
        final_html = str(soup.prettify())
        print(f"✅ Template filled successfully ({len(final_html)} chars)")
        
        return final_html
        
    except Exception as e:
        print(f"❌ Error filling template: {e}")
        import traceback
        traceback.print_exc()
        # Return a basic HTML as fallback
        return create_fallback_html(profile_data, css_template)

def extract_contact_info(profile_data: Dict[str, Any]) -> Dict[str, str]:
    """Extract contact information from profile data"""
    contact = {
        'name': '',
        'email': '',
        'phone': '',
        'linkedin': '',
        'github': '',
        'address': ''
    }
    
    sections = profile_data.get('sections', [])
    
    for section in sections:
        section_name = section.get('section_name', '').lower()
        
        # Look for contact or personal information section
        if any(keyword in section_name for keyword in ['contact', 'personal', 'information', 'details']):
            subsections = section.get('subsections', [])
            
            for subsection in subsections:
                title = subsection.get('title', '').lower()
                data = subsection.get('data', [])
                
                for item in data:
                    item_lower = item.lower()
                    
                    # Extract email
                    email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', item)
                    if email_match:
                        contact['email'] = email_match.group(1)
                    
                    # Extract phone
                    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})', item)
                    if phone_match:
                        contact['phone'] = phone_match.group(1)
                    
                    # Extract LinkedIn
                    if 'linkedin' in item_lower:
                        linkedin_match = re.search(r'(https?://(?:www\.)?linkedin\.com/\S+|linkedin\.com/\S+)', item, re.IGNORECASE)
                        if linkedin_match:
                            contact['linkedin'] = linkedin_match.group(1)
                    
                    # Extract GitHub
                    if 'github' in item_lower:
                        github_match = re.search(r'(https?://(?:www\.)?github\.com/\S+|github\.com/\S+)', item, re.IGNORECASE)
                        if github_match:
                            contact['github'] = github_match.group(1)
                    
                    # Extract name
                    if not contact['name']:
                        # Check if title looks like a name
                        if re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$', title):
                            contact['name'] = title
                        elif re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$', item):
                            contact['name'] = item
    
    # If name still not found, try first section first subsection title
    if not contact['name'] and sections:
        first_section = sections[0]
        subsections = first_section.get('subsections', [])
        if subsections:
            title = subsections[0].get('title', '')
            if title and re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$', title):
                contact['name'] = title
    
    return contact

def create_sections_html(profile_data: Dict[str, Any], contact_info: Dict[str, str]) -> str:
    """Create HTML for all sections - PRESERVING ORIGINAL STRUCTURE"""
    html_parts = []
    
    # Add header/contact section
    html_parts.append(create_header_html(contact_info))
    
    # Add all sections from profile data
    sections = profile_data.get('sections', [])
    
    for section in sections:
        section_name = section.get('section_name', '').lower()
        
        # Skip contact section (already in header)
        if any(keyword in section_name for keyword in ['contact', 'personal information', 'personal details']):
            continue
        
        section_html = create_section_html(section)
        if section_html:
            html_parts.append(section_html)
    
    return '\n'.join(html_parts)

def create_header_html(contact_info: Dict[str, str]) -> str:
    """Create HTML for header section - CLEAN AND PROFESSIONAL"""
    html_parts = [
        '<div class="resume-header">',
        f'<h1 class="name">{contact_info.get("name", "Your Name")}</h1>',
        '<div class="contact-info">'
    ]
    
    contact_parts = []
    
    if contact_info.get('email'):
        contact_parts.append(f'<span class="contact-item email">{contact_info["email"]}</span>')
    
    if contact_info.get('phone'):
        contact_parts.append(f'<span class="contact-item phone">{contact_info["phone"]}</span>')
    
    if contact_info.get('linkedin'):
        linkedin_url = contact_info['linkedin']
        if not linkedin_url.startswith('http'):
            linkedin_url = f'https://{linkedin_url}'
        contact_parts.append(f'<a href="{linkedin_url}" class="contact-item linkedin">LinkedIn</a>')
    
    if contact_info.get('github'):
        github_url = contact_info['github']
        if not github_url.startswith('http'):
            github_url = f'https://{github_url}'
        contact_parts.append(f'<a href="{github_url}" class="contact-item github">GitHub</a>')
    
    html_parts.append(' <span class="separator">|</span> '.join(contact_parts))
    html_parts.append('</div>')
    html_parts.append('</div>')
    
    return '\n'.join(html_parts)

def create_section_html(section: Dict[str, Any]) -> str:
    """Create HTML for a resume section - PRESERVING ORIGINAL FORMAT"""
    section_name = section.get('section_name', '')
    subsections = section.get('subsections', [])
    
    if not section_name or not subsections:
        return ''
    
    html_parts = [
        '<div class="resume-section">',
        f'<h2 class="section-header">{section_name}</h2>',
        '<div class="section-content">'
    ]
    
    for subsection in subsections:
        subsection_html = create_subsection_html(subsection, section_name)
        if subsection_html:
            html_parts.append(subsection_html)
    
    html_parts.append('</div>')
    html_parts.append('</div>')
    
    return '\n'.join(html_parts)

def create_subsection_html(subsection: Dict[str, Any], section_name: str) -> str:
    """Create HTML for a subsection - SMART FORMATTING"""
    title = subsection.get('title', '')
    data = subsection.get('data', [])
    
    if not data:
        return ''
    
    html_parts = ['<div class="subsection">']
    
    # Add title if present and not redundant
    if title and title.strip() and title.strip() != section_name:
        html_parts.append(f'<h3 class="subsection-title">{title}</h3>')
    
    # Format data based on section type
    section_lower = section_name.lower()
    
    if 'skill' in section_lower or 'technical' in section_lower:
        # Skills - comma-separated or badge style
        html_parts.append('<div class="skills-container">')
        for item in data:
            if item.strip():
                html_parts.append(f'<span class="skill-badge">{item}</span>')
        html_parts.append('</div>')
    
    elif 'experience' in section_lower or 'work' in section_lower:
        # Experience - structured format
        html_parts.append('<div class="experience-item">')
        for i, item in enumerate(data):
            if item.strip():
                # First item often contains position/company
                css_class = 'experience-header' if i == 0 else 'experience-detail'
                html_parts.append(f'<p class="{css_class}">{item}</p>')
        html_parts.append('</div>')
    
    elif 'education' in section_lower:
        # Education - structured format
        html_parts.append('<div class="education-item">')
        for i, item in enumerate(data):
            if item.strip():
                # First item often contains degree/institution
                css_class = 'education-header' if i == 0 else 'education-detail'
                html_parts.append(f'<p class="{css_class}">{item}</p>')
        html_parts.append('</div>')
    
    elif 'project' in section_lower:
        # Projects - bullet points with project name
        html_parts.append('<div class="project-item">')
        html_parts.append('<ul class="project-list">')
        for item in data:
            if item.strip():
                html_parts.append(f'<li class="project-detail">{item}</li>')
        html_parts.append('</ul>')
        html_parts.append('</div>')
    
    else:
        # Generic format - clean bullet points
        html_parts.append('<ul class="content-list">')
        for item in data:
            if item.strip():
                html_parts.append(f'<li>{item}</li>')
        html_parts.append('</ul>')
    
    html_parts.append('</div>')
    
    return '\n'.join(html_parts)

def enhance_css(original_css: str) -> str:
    """Enhance original CSS while preserving design"""
    enhanced = original_css + '''

/* Enhanced Professional Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Arial', 'Helvetica', 'Calibri', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 850px;
    margin: 0 auto;
    padding: 40px 20px;
    background: #fff;
}

/* Header Styles */
.resume-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
}

.name {
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.contact-info {
    font-size: 14px;
    color: #555;
    margin-top: 10px;
}

.contact-item {
    color: #555;
    text-decoration: none;
    padding: 0 5px;
}

.contact-item:hover {
    color: #2c3e50;
}

.separator {
    color: #ccc;
    padding: 0 5px;
}

/* Section Styles */
.resume-section {
    margin-bottom: 25px;
}

.section-header {
    font-size: 20px;
    font-weight: bold;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 5px;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.section-content {
    margin-left: 10px;
}

/* Subsection Styles */
.subsection {
    margin-bottom: 20px;
}

.subsection-title {
    font-size: 16px;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 8px;
}

/* Skills Styles */
.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0;
}

.skill-badge {
    background: #ecf0f1;
    color: #2c3e50;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}

/* Experience Styles */
.experience-item,
.education-item {
    margin-bottom: 15px;
}

.experience-header,
.education-header {
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
    font-size: 15px;
}

.experience-detail,
.education-detail {
    margin: 4px 0;
    line-height: 1.6;
    color: #555;
}

/* Project Styles */
.project-item {
    margin-bottom: 15px;
}

.project-list,
.content-list {
    list-style-type: disc;
    margin-left: 20px;
    margin-top: 5px;
}

.project-list li,
.content-list li {
    margin: 5px 0;
    line-height: 1.6;
    color: #555;
}

.project-detail {
    color: #555;
}

/* Links */
a {
    color: #3498db;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Print Styles */
@media print {
    body {
        margin: 0;
        padding: 20px;
        max-width: 100%;
    }
    
    .resume-header {
        border-bottom: 2px solid #000;
    }
    
    .section-header {
        border-bottom: 2px solid #000;
    }
    
    .skill-badge {
        border: 1px solid #000;
        background: #fff;
    }
    
    a {
        color: #000;
        text-decoration: none;
    }
}

/* Responsive */
@media (max-width: 768px) {
    body {
        padding: 20px 10px;
    }
    
    .name {
        font-size: 24px;
    }
    
    .section-header {
        font-size: 18px;
    }
    
    .contact-info {
        font-size: 12px;
    }
}
'''
    
    return enhanced

def create_fallback_html(profile_data: Dict[str, Any], css_template: str) -> str:
    """Create fallback HTML if main template fails"""
    contact_info = extract_contact_info(profile_data)
    sections_html = create_sections_html(profile_data, contact_info)
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - {contact_info.get("name", "Resume")}</title>
    <style>
{enhance_css(css_template)}
    </style>
</head>
<body>
{sections_html}
</body>
</html>'''
    
    return html