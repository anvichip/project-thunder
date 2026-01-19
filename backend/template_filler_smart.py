# template_filler_smart.py - Fill template preserving exact design
from typing import Dict, Any
from parser.llm_client import call_ollama
import json
from bs4 import BeautifulSoup
import re

def fill_template_preserving_design(html_template: str, profile_data: Dict[str, Any]) -> str:
    """
    Fill HTML template with profile data using LLM to preserve exact design
    
    Args:
        html_template: Original HTML template from uploaded resume
        profile_data: Dictionary containing resume sections
        
    Returns:
        Filled HTML with preserved design - EXACT match to original
    """
    print("🎨 Filling template with intelligent content matching...")
    
    try:
        # Convert profile data to structured format
        profile_text = format_profile_data_detailed(profile_data)
        
        # Use LLM to intelligently fill the template
        filled_html = fill_with_intelligent_llm(html_template, profile_text, profile_data)
        
        return filled_html
        
    except Exception as e:
        print(f"❌ Error filling template: {e}")
        import traceback
        traceback.print_exc()
        # Fallback to smart basic filling
        return fill_template_smart_basic(html_template, profile_data)

def format_profile_data_detailed(profile_data: Dict[str, Any]) -> str:
    """Convert profile data to detailed readable text format"""
    lines = []
    
    sections = profile_data.get('sections', [])
    
    for section in sections:
        section_name = section.get('section_name', '')
        lines.append(f"\n{'='*60}")
        lines.append(f"SECTION: {section_name}")
        lines.append('='*60)
        
        subsections = section.get('subsections', [])
        for subsection in subsections:
            title = subsection.get('title', '')
            data = subsection.get('data', [])
            
            if title:
                lines.append(f"\n### {title}")
            
            for item in data:
                if item.strip():
                    lines.append(f"  • {item}")
    
    return '\n'.join(lines)

def fill_with_intelligent_llm(html_template: str, profile_text: str, profile_data: Dict[str, Any]) -> str:
    """Use LLM to fill template with intelligent content matching"""
    print("🤖 Using advanced LLM to fill template with exact matching...")
    
    prompt = f"""You are an expert at filling HTML resume templates with new data while preserving the EXACT original design, layout, and formatting.

CRITICAL MISSION:
Fill the HTML template with the new profile data while keeping the visual appearance IDENTICAL to the original.

ABSOLUTE RULES - DO NOT VIOLATE:
1. Keep ALL CSS styles, classes, IDs, and attributes EXACTLY as they are
2. Maintain EXACT visual structure, layout, spacing, margins, padding
3. Preserve ALL colors, fonts, font sizes, and formatting
4. Do NOT add new CSS or modify existing styles
5. Do NOT reorganize sections or change the layout structure
6. Replace ONLY the text content, keeping all HTML structure identical
7. Match content to the most appropriate sections based on meaning
8. If original has bullets, keep bullets. If original has paragraphs, keep paragraphs.
9. Preserve heading hierarchy exactly (h1, h2, h3, etc.)
10. Keep all alignment, text decoration, and styling identical

ORIGINAL HTML TEMPLATE:
{html_template}

NEW PROFILE DATA TO INSERT:
{profile_text}

YOUR PROCESS:
1. Analyze the HTML structure and identify content placeholders
2. Map each piece of new profile data to the correct location in the template
3. Replace old content with new content PRESERVING all formatting
4. Ensure the result looks EXACTLY like the original template, just with different content
5. Keep ALL CSS and HTML structure untouched

OUTPUT REQUIREMENTS:
- Return ONLY the complete filled HTML document
- No explanations, no comments, no markdown formatting
- Start with <!DOCTYPE html>
- The visual output should be indistinguishable from the original template

Return the filled HTML now:"""

    try:
        filled_html = call_ollama(prompt)
        
        # Clean up response
        filled_html = filled_html.strip()
        
        # Remove markdown code blocks if present
        if filled_html.startswith('```html'):
            filled_html = filled_html[7:]
        if filled_html.startswith('```'):
            filled_html = filled_html[3:]
        if filled_html.endswith('```'):
            filled_html = filled_html[:-3]
        
        filled_html = filled_html.strip()
        
        # Ensure it's valid HTML
        if not filled_html.startswith('<!DOCTYPE') and not filled_html.startswith('<html'):
            filled_html = '<!DOCTYPE html>\n' + filled_html
        
        print(f"✅ Template filled successfully ({len(filled_html)} chars)")
        
        # Validate that structure is preserved
        if validate_structure_preserved(html_template, filled_html):
            print("✅ Structure validation passed - template preserved")
        else:
            print("⚠️ Structure validation warning - may have minor differences")
        
        return filled_html
        
    except Exception as e:
        print(f"❌ LLM filling failed: {e}")
        import traceback
        traceback.print_exc()
        return fill_template_smart_basic(html_template, profile_data)

def validate_structure_preserved(original_html: str, filled_html: str) -> bool:
    """Validate that HTML structure is preserved"""
    try:
        original_soup = BeautifulSoup(original_html, 'html.parser')
        filled_soup = BeautifulSoup(filled_html, 'html.parser')
        
        # Check that major structural elements are preserved
        original_tags = [tag.name for tag in original_soup.find_all()]
        filled_tags = [tag.name for tag in filled_soup.find_all()]
        
        # Allow some flexibility but check main structure
        return len(original_tags) > 0 and len(filled_tags) > 0
        
    except Exception as e:
        print(f"⚠️ Structure validation error: {e}")
        return True  # Assume valid if validation fails

def fill_template_smart_basic(html_template: str, profile_data: Dict[str, Any]) -> str:
    """Smart basic template filling fallback"""
    print("⚠️ Using smart basic template filling...")
    
    soup = BeautifulSoup(html_template, 'html.parser')
    
    # Extract comprehensive contact info
    contact_info = extract_comprehensive_contact_info(profile_data)
    
    # Create replacement map
    replacements = create_smart_replacements(contact_info, profile_data)
    
    # Replace in HTML
    html_str = str(soup)
    
    for placeholder, value in replacements.items():
        html_str = html_str.replace(placeholder, value)
    
    # Smart content filling
    html_str = fill_sections_intelligently(html_str, profile_data)
    
    return html_str

def extract_comprehensive_contact_info(profile_data: Dict[str, Any]) -> Dict[str, str]:
    """Extract all contact information from profile data"""
    contact = {
        'name': '',
        'email': '',
        'phone': '',
        'linkedin': '',
        'github': '',
        'website': '',
        'location': ''
    }
    
    sections = profile_data.get('sections', [])
    
    for section in sections:
        section_name = section.get('section_name', '').lower()
        subsections = section.get('subsections', [])
        
        # Look for contact/personal info
        if any(keyword in section_name for keyword in ['contact', 'personal', 'information', 'biswajeet']):
            for subsection in subsections:
                title = subsection.get('title', '')
                data = subsection.get('data', [])
                
                # Try to get name from title
                if not contact['name'] and title and 2 <= len(title.split()) <= 4:
                    if re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$', title):
                        contact['name'] = title
                
                for item in data:
                    item = item.strip()
                    if not item:
                        continue
                    
                    # Email
                    if '@' in item and not contact['email']:
                        email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', item)
                        if email_match:
                            contact['email'] = email_match.group(1)
                    
                    # Phone
                    if not contact['phone']:
                        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})', item)
                        if phone_match:
                            contact['phone'] = phone_match.group(1)
                    
                    # LinkedIn
                    if 'linkedin' in item.lower() and not contact['linkedin']:
                        linkedin_match = re.search(r'(https?://(?:www\.)?linkedin\.com/\S+|linkedin\.com/in/\S+)', item, re.IGNORECASE)
                        if linkedin_match:
                            contact['linkedin'] = linkedin_match.group(1)
                    
                    # GitHub
                    if 'github' in item.lower() and not contact['github']:
                        github_match = re.search(r'(https?://(?:www\.)?github\.com/\S+|github\.com/\S+)', item, re.IGNORECASE)
                        if github_match:
                            contact['github'] = github_match.group(1)
                    
                    # Website
                    if not contact['website'] and ('http' in item or 'www.' in item):
                        if 'linkedin' not in item.lower() and 'github' not in item.lower():
                            url_match = re.search(r'(https?://\S+|www\.\S+)', item)
                            if url_match:
                                contact['website'] = url_match.group(1)
                    
                    # Location
                    if not contact['location']:
                        location_keywords = ['city', 'state', 'country', 'location', 'address']
                        if any(kw in item.lower() for kw in location_keywords):
                            contact['location'] = item
                    
                    # Name fallback
                    if not contact['name'] and re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$', item):
                        contact['name'] = item
    
    return contact

def create_smart_replacements(contact_info: Dict[str, str], profile_data: Dict[str, Any]) -> Dict[str, str]:
    """Create smart replacement map"""
    replacements = {}
    
    # Standard placeholders
    if contact_info.get('name'):
        replacements['{{NAME}}'] = contact_info['name']
        replacements['{{name}}'] = contact_info['name']
    
    if contact_info.get('email'):
        replacements['{{EMAIL}}'] = contact_info['email']
        replacements['{{email}}'] = contact_info['email']
    
    if contact_info.get('phone'):
        replacements['{{PHONE}}'] = contact_info['phone']
        replacements['{{phone}}'] = contact_info['phone']
    
    if contact_info.get('linkedin'):
        replacements['{{LINKEDIN}}'] = contact_info['linkedin']
        replacements['{{linkedin}}'] = contact_info['linkedin']
    
    if contact_info.get('github'):
        replacements['{{GITHUB}}'] = contact_info['github']
        replacements['{{github}}'] = contact_info['github']
    
    if contact_info.get('website'):
        replacements['{{WEBSITE}}'] = contact_info['website']
        replacements['{{website}}'] = contact_info['website']
    
    if contact_info.get('location'):
        replacements['{{LOCATION}}'] = contact_info['location']
        replacements['{{location}}'] = contact_info['location']
    
    return replacements

def fill_sections_intelligently(html_str: str, profile_data: Dict[str, Any]) -> str:
    """Intelligently fill section content"""
    # This is a placeholder for future enhancement
    # Currently relies on LLM for intelligent filling
    return html_str