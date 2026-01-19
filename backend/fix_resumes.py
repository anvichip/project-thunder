# fix_resumes.py - Run this to fix existing resumes
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "careerhub")

async def fix_resumes():
    """Fix all existing resumes that don't have proper HTML content"""
    
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    resumes_collection = db.generated_resumes
    profiles_collection = db.profiles
    templates_collection = db.resume_templates
    
    print("🔧 Starting resume fix process...")
    
    # Find all resumes
    resumes = await resumes_collection.find({}).to_list(None)
    
    print(f"📊 Found {len(resumes)} resumes")
    
    fixed_count = 0
    error_count = 0
    
    for resume in resumes:
        email = resume.get("user_email")
        resume_id = resume.get("resume_id")
        
        print(f"\n{'='*60}")
        print(f"📧 Processing: {email}")
        print(f"🆔 Resume ID: {resume_id}")
        
        # Check if HTML content exists and is valid
        html_content = resume.get("html_content", "")
        
        if html_content and len(html_content) > 100 and "<!DOCTYPE" in html_content:
            print(f"✅ Resume already has valid HTML ({len(html_content)} chars)")
            continue
        
        print(f"⚠️ Resume needs fixing...")
        
        try:
            # Get profile
            profile = await profiles_collection.find_one({"email": email})
            if not profile:
                print(f"❌ No profile found for {email}")
                error_count += 1
                continue
            
            # Get template
            template = await templates_collection.find_one({"user_email": email})
            if not template:
                print(f"❌ No template found for {email}")
                error_count += 1
                continue
            
            # Generate HTML
            print(f"🎨 Generating HTML...")
            
            # Import template filler
            try:
                from template_filler_smart import fill_template_preserving_design
                
                filled_html = fill_template_preserving_design(
                    template['html_template'],
                    profile['resumeData']
                )
                
                if not filled_html or len(filled_html) < 100:
                    raise Exception("Generated HTML is too short")
                
            except Exception as fill_error:
                print(f"⚠️ Smart filling failed: {fill_error}")
                print(f"📝 Using basic HTML generation...")
                
                # Fallback to basic HTML
                filled_html = generate_basic_html_fallback(profile['resumeData'])
            
            # Update resume
            await resumes_collection.update_one(
                {"_id": resume["_id"]},
                {"$set": {
                    "html_content": filled_html,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            print(f"✅ Resume fixed! HTML length: {len(filled_html)} chars")
            fixed_count += 1
            
        except Exception as e:
            print(f"❌ Error fixing resume: {e}")
            import traceback
            traceback.print_exc()
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"🎉 Fix process completed!")
    print(f"✅ Fixed: {fixed_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📊 Total processed: {len(resumes)}")
    
    client.close()


def generate_basic_html_fallback(profile_data: dict) -> str:
    """Generate basic HTML as fallback"""
    sections = profile_data.get('sections', [])
    
    html = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            padding: 40px 20px;
            max-width: 850px;
            margin: 0 auto;
        }
        .section { 
            margin: 25px 0; 
        }
        .section-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #2c3e50;
            border-bottom: 2px solid #3498db; 
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        .subsection { 
            margin: 15px 0 15px 20px; 
        }
        .subsection-title { 
            font-weight: bold; 
            color: #34495e;
            margin-bottom: 8px;
            font-size: 16px;
        }
        .data-item { 
            margin: 6px 0 6px 20px;
            position: relative;
        }
        .data-item:before {
            content: "•";
            position: absolute;
            left: -15px;
            color: #3498db;
            font-weight: bold;
        }
        @media print {
            body { padding: 20px; }
        }
    </style>
</head>
<body>
'''
    
    for section in sections:
        section_name = section.get('section_name', '')
        if not section_name:
            continue
            
        html += f'<div class="section">\n'
        html += f'<div class="section-title">{section_name}</div>\n'
        
        for subsection in section.get('subsections', []):
            html += '<div class="subsection">\n'
            
            title = subsection.get('title', '')
            if title and title.strip():
                html += f'<div class="subsection-title">{title}</div>\n'
            
            for item in subsection.get('data', []):
                if item and item.strip():
                    html += f'<div class="data-item">{item}</div>\n'
            
            html += '</div>\n'
        
        html += '</div>\n'
    
    html += '</body>\n</html>'
    
    return html


if __name__ == "__main__":
    print("🚀 Resume Fix Utility")
    print("="*60)
    asyncio.run(fix_resumes())