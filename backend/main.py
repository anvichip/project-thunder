# main.py - UPDATED VERSION with empty array filtering
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, Response
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import traceback
import json
from dotenv import load_dotenv
from bson import ObjectId
import secrets
import PyPDF2
import hashlib
import re
import io
# Import resume parser with explicit output path
from parser.resume_parser_llm import main as parse_resume_llm
from scorer.keyword_matcher import extract_skills_from_jd, compare_skills

load_dotenv()

app = FastAPI(title="CareerHub API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "careerhub")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]
users_collection = db.users
profiles_collection = db.profiles
templates_collection = db.resume_templates
resumes_collection = db.generated_resumes

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Directories
UPLOAD_DIR = "uploads"
TEMP_DIR = "temp"
OUTPUT_DIR = "output"

for directory in [UPLOAD_DIR, TEMP_DIR, OUTPUT_DIR]:
    os.makedirs(directory, exist_ok=True)

# Pydantic Models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Auth0LoginRequest(BaseModel):
    uid: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    auth_provider: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class SubSection(BaseModel):
    title: str
    data: List[str]

class ResumeSection(BaseModel):
    section_name: str
    subsections: List[SubSection]

class SaveProfileRequest(BaseModel):
    email: EmailStr
    resumeData: Dict[str, Any]
    selectedRoles: List[str]

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

def generate_unique_resume_id(email: str) -> str:
    """Generate a unique sharable resume ID"""
    timestamp = datetime.utcnow().isoformat()
    random_token = secrets.token_urlsafe(16)
    unique_string = f"{email}_{timestamp}_{random_token}"
    hash_obj = hashlib.sha256(unique_string.encode())
    return hash_obj.hexdigest()[:16]

def make_links_clickable(text: str) -> str:
    """Convert URLs in text to clickable HTML links"""
    # URL regex pattern
    url_pattern = r'(https?://[^\s<>"]+|www\.[^\s<>"]+)'
    
    def replace_url(match):
        url = match.group(1)
        # Add https:// if it starts with www.
        full_url = url if url.startswith('http') else f'https://{url}'
        return f'<a href="{full_url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">{url}</a>'
    
    return re.sub(url_pattern, replace_url, text)

def clean_empty_sections(sections: list) -> list:
    """Remove sections and subsections with empty data arrays"""
    cleaned_sections = []
    
    for section in sections:
        subsections = section.get('subsections', [])
        
        # Filter out subsections with empty data
        cleaned_subsections = []
        for subsection in subsections:
            data = subsection.get('data', [])
            # Only keep subsections with non-empty data
            if data and len(data) > 0 and any(item.strip() for item in data if item):
                cleaned_subsections.append(subsection)
        
        # Only add section if it has valid subsections
        if cleaned_subsections:
            section_copy = section.copy()
            section_copy['subsections'] = cleaned_subsections
            cleaned_sections.append(section_copy)
    
    return cleaned_sections

async def migrate_existing_resumes():
    """Add resume_id and sharable_link to existing resumes that don't have them"""
    try:
        print("🔄 Checking for resumes needing migration...")
        
        resumes_without_id = await resumes_collection.find({"resume_id": {"$exists": False}}).to_list(None)
        
        if resumes_without_id:
            print(f"📝 Found {len(resumes_without_id)} resumes to migrate")
            
            for resume in resumes_without_id:
                email = resume.get("user_email", "unknown")
                new_id = generate_unique_resume_id(email)
                new_link = f"/resume/{new_id}"
                
                await resumes_collection.update_one(
                    {"_id": resume["_id"]},
                    {"$set": {
                        "resume_id": new_id,
                        "sharable_link": new_link,
                        "view_count": resume.get("view_count", 0)
                    }}
                )
                print(f"  ✅ Migrated resume for {email}")
            
            print(f"✅ Migration complete: {len(resumes_without_id)} resumes updated")
        else:
            print("✅ No resumes need migration")
            
    except Exception as e:
        print(f"⚠️ Migration warning: {e}")
        traceback.print_exc()

@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("✅ Connected to MongoDB successfully")
        
        await users_collection.create_index("email", unique=True)
        await profiles_collection.create_index("email", unique=True)
        await templates_collection.create_index("user_email")
        await resumes_collection.create_index("user_email")
        
        try:
            await resumes_collection.create_index("resume_id", unique=True, sparse=True)
        except Exception as e:
            print(f"⚠️ Resume ID index warning: {e}")
        
        print("✅ Database indexes created")
        
        await migrate_existing_resumes()
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        traceback.print_exc()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.get("/")
async def root():
    return {"message": "CareerHub API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    try:
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Auth Endpoints (keeping existing code)
@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    try:
        print(f"📝 Registration attempt for: {user_data.email}")
        
        existing_user = await users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user_data.password)
        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "auth_provider": "email",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "profile_completed": False
        }
        
        result = await users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        
        access_token = create_access_token(data={"sub": user_data.email})
        
        print(f"✅ User registered: {user_data.email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user_doc["_id"]),
                "username": user_doc["username"],
                "email": user_doc["email"],
                "auth_provider": user_doc["auth_provider"],
                "profile_completed": user_doc["profile_completed"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Registration error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    try:
        print(f"🔐 Login attempt for: {user_data.email}")
        
        user = await users_collection.find_one({"email": user_data.email})
        if not user:
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        if not verify_password(user_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        access_token = create_access_token(data={"sub": user["email"]})
        
        print(f"✅ Login successful: {user_data.email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "username": user.get("username", ""),
                "email": user["email"],
                "name": user.get("name", ""),
                "auth_provider": user.get("auth_provider", "email"),
                "picture": user.get("picture"),
                "profile_completed": user.get("profile_completed", False)
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/auth0-login", response_model=Token)
async def auth0_login(auth_data: Auth0LoginRequest):
    try:
        print(f"🔐 Auth0 login for: {auth_data.email}, provider: {auth_data.auth_provider}")
        
        email = auth_data.email
        user = await users_collection.find_one({"email": email})
        
        if not user:
            print(f"📝 Creating new user via Auth0: {email}")
            user_doc = {
                "email": email,
                "username": auth_data.name,
                "name": auth_data.name,
                "auth_uid": auth_data.uid,
                "picture": auth_data.picture,
                "auth_provider": auth_data.auth_provider,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "profile_completed": False
            }
            result = await users_collection.insert_one(user_doc)
            user_doc["_id"] = result.inserted_id
            user = user_doc
        else:
            await users_collection.update_one(
                {"email": email},
                {"$set": {
                    "auth_uid": auth_data.uid,
                    "picture": auth_data.picture,
                    "name": auth_data.name,
                    "auth_provider": auth_data.auth_provider,
                    "updated_at": datetime.utcnow()
                }}
            )
            user = await users_collection.find_one({"email": email})
        
        access_token = create_access_token(data={"sub": email})
        
        print(f"✅ Auth0 login successful: {email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "username": user.get("username", user.get("name", "")),
                "email": user["email"],
                "name": user.get("name", ""),
                "auth_provider": user.get("auth_provider", "email"),
                "picture": user.get("picture"),
                "profile_completed": user.get("profile_completed", False)
            }
        }
    except Exception as e:
        print(f"❌ Auth0 login error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Resume Upload
@app.post("/api/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    userId: str = Form(...)
):
    temp_path = None
    parsed_json_path = None
    
    try:
        print(f"📤 Resume upload started for user: {userId}")
        print(f"📄 File: {file.filename}, Content-Type: {file.content_type}")
        
        if not userId or '@' not in userId:
            raise HTTPException(status_code=400, detail="Valid user email is required")
        
        if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")
        
        safe_email = userId.replace('@', '_at_').replace('.', '_')
        safe_filename = file.filename.replace(' ', '_')
        temp_path = os.path.join(TEMP_DIR, f"{safe_email}_{safe_filename}")
        parsed_json_path = os.path.join(TEMP_DIR, f"{safe_email}_parsed.json")
        
        print(f"💾 Saving to: {temp_path}")
        print(f"📝 Output will be saved to: {parsed_json_path}")
        
        os.makedirs(TEMP_DIR, exist_ok=True)
        
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        file_size = os.path.getsize(temp_path)
        print(f"📊 File size: {file_size / 1024:.2f} KB")
        print(f"✅ File saved successfully at: {temp_path}")
        
        print(f"🎨 Extracting HTML template from uploaded resume...")
        original_html_template = None
        
        try:
            from template_extractor_smart import extract_html_from_resume
            import time
            start_time = time.time()
            original_html_template = extract_html_from_resume(temp_path)
            end_time = time.time()
            print(f"⏱️ HTML Extraction completed in {end_time - start_time:.2f} seconds")
            print(f"✅ Original HTML template extracted ({len(original_html_template)} chars)")
        except Exception as template_error:
            print(f"⚠️ Template extraction failed: {template_error}")
            traceback.print_exc()
        
        print(f"🤖 Starting LLM parsing with output path: {parsed_json_path}")
        
        try:
            import time
            start_time = time.time()
            output_file = parse_resume_llm(temp_path, parsed_json_path)
            end_time = time.time()
            print(f"⏱️ LLM parsing completed in {end_time - start_time:.2f} seconds")
            print(f"✅ LLM parsing completed, output: {output_file}")
        except Exception as parse_error:
            print(f"❌ LLM parsing failed: {parse_error}")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(parse_error)}")
        
        if not os.path.exists(parsed_json_path):
            print(f"❌ Output file not found at: {parsed_json_path}")
            print(f"📂 Temp directory contents: {os.listdir(TEMP_DIR)}")
            raise HTTPException(status_code=500, detail=f"Parsing output file not found: {parsed_json_path}")
        
        print(f"✅ Found output file: {parsed_json_path}")
        
        with open(parsed_json_path, 'r', encoding='utf-8') as f:
            extracted_data = json.load(f)
        
        if 'sections' not in extracted_data or not isinstance(extracted_data['sections'], list):
            raise HTTPException(status_code=500, detail="Invalid parsing result structure")
        
        # Clean empty sections before saving
        extracted_data['sections'] = clean_empty_sections(extracted_data['sections'])
        
        template_id = None
        if original_html_template:
            template_doc = {
                "user_email": userId,
                "filename": file.filename,
                "html_template": original_html_template,
                "created_at": datetime.utcnow(),
                "is_default": True
            }
            
            await templates_collection.update_many(
                {"user_email": userId},
                {"$set": {"is_default": False}}
            )
            
            template_result = await templates_collection.insert_one(template_doc)
            template_id = str(template_result.inserted_id)
            print(f"✅ Template saved to database with ID: {template_id}")
        
        print(f"✅ Resume parsed successfully with {len(extracted_data['sections'])} sections")
        
        return {
            "message": "Resume parsed successfully",
            "extractedData": extracted_data,
            "templateId": template_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Resume upload error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                print(f"🗑️ Cleaned up temp file: {temp_path}")
            except Exception as e:
                print(f"⚠️ Failed to clean up temp file: {e}")
        
        if parsed_json_path and os.path.exists(parsed_json_path):
            try:
                os.remove(parsed_json_path)
                print(f"🗑️ Cleaned up parsed JSON: {parsed_json_path}")
            except Exception as e:
                print(f"⚠️ Failed to clean up JSON file: {e}")

@app.post("/api/debug/regenerate-resume/{email}")
async def debug_regenerate_resume(email: str):
    """Debug endpoint to manually regenerate resume"""
    try:
        print(f"🔧 DEBUG: Manually regenerating resume for: {email}")
        
        profile = await profiles_collection.find_one({"email": email})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        template = await templates_collection.find_one({"user_email": email})
        if not template:
            raise HTTPException(status_code=404, detail="Template not found - please re-upload resume")
        
        resume_info = await generate_user_resume(email)
        
        if not resume_info:
            raise HTTPException(status_code=500, detail="Failed to generate resume")
        
        resume = await resumes_collection.find_one({"user_email": email})
        
        debug_info = {
            "status": "success",
            "resume_id": resume_info["resume_id"],
            "sharable_link": resume_info["sharable_link"],
            "has_html_content": bool(resume.get("html_content")),
            "html_length": len(resume.get("html_content", "")),
            "metadata": resume_info["metadata"],
            "view_count": resume.get("view_count", 0)
        }
        
        print(f"✅ DEBUG: Resume regenerated successfully")
        print(f"   - HTML length: {debug_info['html_length']} chars")
        print(f"   - Resume ID: {debug_info['resume_id']}")
        
        return debug_info
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ DEBUG: Regeneration failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug/check-resume/{email}")
async def debug_check_resume(email: str):
    """Debug endpoint to check resume status"""
    try:
        print(f"🔍 DEBUG: Checking resume for: {email}")
        
        profile = await profiles_collection.find_one({"email": email})
        template = await templates_collection.find_one({"user_email": email})
        resume = await resumes_collection.find_one({"user_email": email})
        
        return {
            "email": email,
            "has_profile": bool(profile),
            "profile_sections": len(profile.get("resumeData", {}).get("sections", [])) if profile else 0,
            "has_template": bool(template),
            "template_size": len(template.get("html_template", "")) if template else 0,
            "has_resume": bool(resume),
            "resume_id": resume.get("resume_id") if resume else None,
            "has_html_content": bool(resume.get("html_content")) if resume else False,
            "html_size": len(resume.get("html_content", "")) if resume else 0,
            "sharable_link": resume.get("sharable_link") if resume else None,
            "view_count": resume.get("view_count", 0) if resume else 0
        }
        
    except Exception as e:
        print(f"❌ DEBUG: Check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Profile Management
@app.post("/api/save-user-profile")
async def save_user_profile(request: SaveProfileRequest):
    try:
        print(f"💾 Saving profile for: {request.email}")
        
        # Clean empty sections before saving
        cleaned_sections = clean_empty_sections(request.resumeData.get('sections', []))
        request.resumeData['sections'] = cleaned_sections
        
        profile_data = {
            "email": request.email,
            "resumeData": request.resumeData,
            "selectedRoles": request.selectedRoles,
            "updatedAt": datetime.utcnow()
        }
        
        existing_profile = await profiles_collection.find_one({"email": request.email})
        
        if existing_profile:
            await profiles_collection.update_one(
                {"email": request.email},
                {"$set": profile_data}
            )
            message = "Profile updated successfully"
        else:
            profile_data["createdAt"] = datetime.utcnow()
            await profiles_collection.insert_one(profile_data)
            message = "Profile created successfully"
        
        await users_collection.update_one(
            {"email": request.email},
            {"$set": {"profile_completed": True}}
        )
        
        resume_info = await generate_user_resume(request.email)
        
        print(f"✅ {message}: {request.email}")
        return {
            "message": message,
            "email": request.email,
            "resumeInfo": resume_info
        }
        
    except Exception as e:
        print(f"❌ Save profile error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

async def generate_user_resume(email: str):
    """Generate HTML resume with EXACT match and create sharable link"""
    try:
        print(f"🎨 Generating resume for: {email}")
        
        profile = await profiles_collection.find_one({"email": email})
        if not profile:
            print(f"⚠️ No profile found for: {email}")
            return None
        
        # Clean empty sections from profile data
        profile_data = profile.get('resumeData', {})
        profile_data['sections'] = clean_empty_sections(profile_data.get('sections', []))
        
        template = await templates_collection.find_one({
            "user_email": email,
            "is_default": True
        })
        
        if not template:
            template = await templates_collection.find_one({"user_email": email})
        
        if not template:
            print(f"⚠️ No template found for: {email}")
            return None
        
        from template_filler_smart import fill_template_preserving_design
        
        filled_html = fill_template_preserving_design(
            template['html_template'],
            profile_data
        )
        
        if not filled_html or len(filled_html) < 100:
            print(f"⚠️ Generated HTML is too short or empty")
            filled_html = generate_basic_html_resume(profile_data)
        
        existing_resume = await resumes_collection.find_one({"user_email": email})
        
        if existing_resume and existing_resume.get("resume_id"):
            resume_id = existing_resume["resume_id"]
            sharable_link = existing_resume["sharable_link"]
        else:
            resume_id = generate_unique_resume_id(email)
            sharable_link = f"/resume/{resume_id}"
        
        resume_metadata = extract_resume_metadata(profile_data)
        
        resume_doc = {
            "user_email": email,
            "resume_id": resume_id,
            "template_id": str(template['_id']),
            "html_content": filled_html,
            "profile_data": profile_data,
            "sharable_link": sharable_link,
            "metadata": resume_metadata,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "view_count": existing_resume.get("view_count", 0) if existing_resume else 0
        }
        
        if existing_resume:
            await resumes_collection.update_one(
                {"user_email": email},
                {"$set": resume_doc}
            )
            print(f"✅ Resume updated for: {email} (ID: {resume_id})")
        else:
            await resumes_collection.insert_one(resume_doc)
            print(f"✅ Resume created for: {email} (ID: {resume_id})")
        
        return {
            "resume_id": resume_id,
            "sharable_link": sharable_link,
            "metadata": resume_metadata
        }
        
    except Exception as e:
        print(f"❌ Generate resume error: {e}")
        import traceback
        traceback.print_exc()
        return None

def extract_resume_metadata(resume_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract metadata for resume tile display"""
    import re
    
    metadata = {
        "name": "",
        "title": "",
        "email": "",
        "phone": "",
        "sections_count": 0,
        "last_updated": datetime.utcnow().isoformat()
    }
    
    sections = resume_data.get('sections', [])
    metadata["sections_count"] = len(sections)
    
    for section in sections:
        section_name = section.get('section_name', '').lower()
        subsections = section.get('subsections', [])
        
        if any(keyword in section_name for keyword in ['contact', 'personal', 'information', 'name']):
            for subsection in subsections:
                data = subsection.get('data', [])
                title = subsection.get('title', '').strip()
                
                if title and not metadata['name']:
                    title_words = title.split()
                    if 2 <= len(title_words) <= 4:
                        has_capitals = sum(1 for word in title_words if word and word[0].isupper()) >= len(title_words) / 2
                        is_field_name = any(keyword in title.lower() for keyword in ['email', 'phone', 'address', 'location', 'linkedin', 'github'])
                        
                        if has_capitals and not is_field_name:
                            metadata['name'] = title
                            print(f"📝 Extracted name from title: {title}")
                
                if not metadata['name'] and data and len(data) > 0:
                    first_item = data[0].strip()
                    if first_item and '@' not in first_item and 'http' not in first_item.lower():
                        words = first_item.split()
                        if 2 <= len(words) <= 4:
                            has_capitals = sum(1 for word in words if word and word[0].isupper()) >= len(words) / 2
                            if has_capitals:
                                metadata['name'] = first_item
                                print(f"📝 Extracted name from data: {first_item}")
                
                for item in data:
                    if '@' in item and not metadata['email']:
                        email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', item)
                        if email_match:
                            metadata['email'] = email_match.group(1)
                    
                    if not metadata['phone']:
                        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})', item)
                        if phone_match:
                            metadata['phone'] = phone_match.group(1)
        
        if not metadata['title'] and 'experience' in section_name and subsections:
            first_subsection = subsections[0]
            title = first_subsection.get('title', '')
            if title:
                metadata['title'] = title
    
    print(f"✅ Metadata extracted: name='{metadata['name']}', email='{metadata['email']}', phone='{metadata['phone']}'")
    return metadata

@app.get("/api/user-resume/{email}")
async def get_user_resume(email: str):
    """Get user's resume metadata"""
    try:
        print(f"📖 Fetching resume metadata for: {email}")
        
        resume = await resumes_collection.find_one({"user_email": email})
        
        if not resume:
            print(f"⚠️ Resume not found, attempting to generate...")
            
            profile = await profiles_collection.find_one({"email": email})
            if not profile:
                raise HTTPException(
                    status_code=404, 
                    detail="Profile not found. Please complete your profile setup first."
                )
            
            resume_info = await generate_user_resume(email)
            if not resume_info:
                raise HTTPException(
                    status_code=500, 
                    detail="Failed to generate resume. Please try uploading your resume again."
                )
            
            resume = await resumes_collection.find_one({"user_email": email})
            
            if not resume:
                raise HTTPException(
                    status_code=500,
                    detail="Resume generation completed but could not be retrieved"
                )
        
        if not resume.get("resume_id"):
            print(f"⚠️ Resume missing resume_id, regenerating...")
            new_id = generate_unique_resume_id(email)
            new_link = f"/resume/{new_id}"
            
            await resumes_collection.update_one(
                {"_id": resume["_id"]},
                {"$set": {
                    "resume_id": new_id,
                    "sharable_link": new_link
                }}
            )
            
            resume = await resumes_collection.find_one({"user_email": email})
        
        response = {
            "_id": str(resume["_id"]),
            "resume_id": resume.get("resume_id", ""),
            "sharable_link": resume.get("sharable_link", ""),
            "metadata": resume.get("metadata", {
                "name": "",
                "title": "",
                "email": email,
                "phone": "",
                "sections_count": 0,
                "last_updated": datetime.utcnow().isoformat()
            }),
            "view_count": resume.get("view_count", 0),
            "created_at": resume.get("created_at", datetime.utcnow()).isoformat() if isinstance(resume.get("created_at"), datetime) else datetime.utcnow().isoformat(),
            "updated_at": resume.get("updated_at", datetime.utcnow()).isoformat() if isinstance(resume.get("updated_at"), datetime) else datetime.utcnow().isoformat()
        }
        
        print(f"✅ Resume metadata found: {email} (ID: {response['resume_id']})")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Get resume error: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while loading your resume: {str(e)}"
        )

def generate_html_from_profile_data(profile_data: dict, metadata: dict) -> str:
    """Generate clean HTML from profile JSON data with clickable links"""
    sections = profile_data.get('sections', [])
    
    # Clean empty sections
    sections = clean_empty_sections(sections)
    
    contact_info = extract_contact_from_sections(sections)
    
    name = contact_info.get('name') or metadata.get('name') or 'Resume'
    
    print(f"🎨 Generating HTML for: {name}")
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{name} – Resume</title>
  <style>
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f9fafb;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      color: #1f2937;
    }}

    .container {{
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3em;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }}

    header {{
      text-align: center;
      margin-bottom: 2em;
      padding-bottom: 1.5em;
      border-bottom: 2px solid #3b82f6;
    }}

    h1 {{
      margin: 0 0 0.5em 0;
      font-size: 2.5em;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
    }}

    h2 {{
      margin-top: 2em;
      padding-bottom: 6px;
      font-size: 1.4em;
      font-weight: 700;
      border-bottom: 2px solid #e5e7eb;
      color: #374151;
      margin-bottom: 1em;
      letter-spacing: -0.015em;
    }}

    h3 {{
      margin: 0.8em 0 0.3em 0;
      font-size: 1.15em;
      color: #111827;
      font-weight: 700;
    }}

    address {{
      font-style: normal;
      color: #4b5563;
      font-size: 0.95em;
      line-height: 1.7;
    }}

    ul {{
      margin: 0.5em 0 0.5em 1.2em;
      padding-left: 0;
    }}

    li {{
      margin: 0.35em 0;
      line-height: 1.6;
      color: #374151;
    }}

    p {{
      margin: 0.4em 0;
      font-size: 0.98em;
      color: #374151;
      line-height: 1.6;
    }}

    a {{
      color: #3b82f6;
      text-decoration: underline;
      font-weight: 600;
      transition: color 0.2s;
    }}

    a:hover {{ color: #2563eb; }}

    .section {{ margin-bottom: 2em; }}
    .subsection {{ margin-bottom: 1.2em; }}
    .contact-links {{ margin-top: 0.6em; }}
    .separator {{ margin: 0 0.4em; color: #9ca3af; }}

    @media print {{
      body {{ background: white; padding: 0; }}
      .container {{ box-shadow: none; padding: 1em; }}
    }}
  </style>
</head>

<body>
  <div class="container">
    <header>
      <h1>{name}</h1>
      <address>
"""
    
    if contact_info.get('links'):
        html += f"        <div class=\"contact-links\">{' <span class=\"separator\">•</span> '.join(contact_info['links'])}</div>\n"
    
    contact_line = []
    email = contact_info.get('email') or metadata.get('email')
    phone = contact_info.get('phone') or metadata.get('phone')
    
    if email:
        contact_line.append(f'<a href="mailto:{email}">{email}</a>')
    if phone:
        contact_line.append(phone)
    
    if contact_line:
        html += f"        <div style=\"margin-top: 0.5em;\">{' <span class=\"separator\">•</span> '.join(contact_line)}</div>\n"
    
    html += """      </address>
    </header>

"""
    
    for section in sections:
        section_name = section.get('section_name', '').lower()
        
        if any(keyword in section_name for keyword in ['contact', 'personal information', 'name']):
            continue
        
        html += f"    <section class=\"section\">\n"
        html += f"      <h2>{section.get('section_name', 'Section')}</h2>\n"
        
        subsections = section.get('subsections', [])
        for subsection in subsections:
            html += generate_subsection_html(subsection, section.get('section_name', ''))
        
        html += "    </section>\n\n"
    
    html += """  </div>
</body>
</html>"""
    
    return html

def extract_contact_from_sections(sections: list) -> dict:
    """Extract contact information from sections"""
    import re
    
    info = {
        'name': '',
        'email': '',
        'phone': '',
        'links': []
    }
    
    for section in sections:
        section_name = section.get('section_name', '').lower()
        
        if any(keyword in section_name for keyword in ['contact', 'personal', 'information', 'name']):
            for subsection in section.get('subsections', []):
                title = subsection.get('title', '').strip()
                data = subsection.get('data', [])
                
                if title and not info['name']:
                    title_words = title.split()
                    if 2 <= len(title_words) <= 4:
                        has_capitals = sum(1 for word in title_words if word and word[0].isupper()) >= len(title_words) / 2
                        is_field_name = any(keyword in title.lower() for keyword in ['email', 'phone', 'address', 'location', 'linkedin', 'github'])
                        if has_capitals and not is_field_name:
                            info['name'] = title
                
                if not info['name'] and data and len(data) > 0:
                    first_item = data[0].strip()
                    if first_item and '@' not in first_item and 'http' not in first_item.lower():
                        words = first_item.split()
                        if 2 <= len(words) <= 4:
                            has_capitals = sum(1 for word in words if word and word[0].isupper()) >= len(words) / 2
                            if has_capitals:
                                info['name'] = first_item
                
                for item in data:
                    if '@' in item and not info['email']:
                        email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', item)
                        if email_match:
                            info['email'] = email_match.group(1)
                    
                    if not info['phone'] and re.search(r'[\d\+\-\(\)\s]{8,}', item):
                        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})', item)
                        if phone_match:
                            info['phone'] = phone_match.group(1)
                    
                    if 'github' in item.lower() or 'github.com' in item:
                        match = re.search(r'(https?://github\.com/[^\s)]+|github\.com/[^\s)]+)', item, re.IGNORECASE)
                        if match:
                            url = match.group(1) if match.group(1).startswith('http') else f'https://{match.group(1)}'
                            link = f'<a href="{url}" target="_blank" rel="noopener noreferrer">GitHub</a>'
                            if link not in info['links']:
                                info['links'].append(link)
                    
                    if 'linkedin' in item.lower() or 'linkedin.com' in item:
                        match = re.search(r'(https?://(?:www\.)?linkedin\.com/[^\s)]+|linkedin\.com/[^\s)]+)', item, re.IGNORECASE)
                        if match:
                            url = match.group(1) if match.group(1).startswith('http') else f'https://{match.group(1)}'
                            link = f'<a href="{url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>'
                            if link not in info['links']:
                                info['links'].append(link)
                    
                    if ('http' in item or 'www.' in item) and 'github' not in item.lower() and 'linkedin' not in item.lower():
                        match = re.search(r'(https?://[^\s)]+|www\.[^\s)]+)', item, re.IGNORECASE)
                        if match:
                            url = match.group(1) if match.group(1).startswith('http') else f'https://{match.group(1)}'
                            portfolio_link = f'<a href="{url}" target="_blank" rel="noopener noreferrer">Portfolio</a>'
                            if portfolio_link not in info['links']:
                                info['links'].append(portfolio_link)
    
    seen = set()
    unique_links = []
    for link in info['links']:
        if link not in seen:
            seen.add(link)
            unique_links.append(link)
    info['links'] = unique_links
    
    return info

def generate_subsection_html(subsection: dict, section_name: str) -> str:
    """Generate HTML for a subsection with clickable links"""
    title = subsection.get('title', '')
    data = subsection.get('data', [])
    section_lower = section_name.lower()
    
    # Filter out empty data
    data = [item for item in data if item and item.strip()]
    
    if not data:
        return ""
    
    html = "      <div class=\"subsection\">\n"
    
    # Skills section - inline
    if 'skill' in section_lower or 'technical' in section_lower:
        data_with_links = [make_links_clickable(item) for item in data]
        if title:
            html += f"        <p><strong>{make_links_clickable(title)}:</strong> {', '.join(data_with_links)}</p>\n"
        else:
            html += f"        <p>{', '.join(data_with_links)}</p>\n"
    
    elif 'achievement' in section_lower or 'award' in section_lower:
        html += "        <ul>\n"
        if title:
            data_text = ' '.join([make_links_clickable(item) for item in data])
            html += f"          <li><strong>{make_links_clickable(title)}:</strong> {data_text}</li>\n"
        else:
            for item in data:
                html += f"          <li>{make_links_clickable(item)}</li>\n"
        html += "        </ul>\n"
    
    elif 'coursework' in section_lower or 'course' in section_lower:
        if title:
            html += f"        <p><strong>{make_links_clickable(title)}:</strong></p>\n"
        html += "        <ul>\n"
        for item in data:
            html += f"          <li>{make_links_clickable(item)}</li>\n"
        html += "        </ul>\n"
    
    elif any(keyword in section_lower for keyword in ['experience', 'education', 'project', 'position', 'responsibility']):
        if title:
            html += f"        <h3>{make_links_clickable(title)}</h3>\n"
        
        if data:
            first_item = data[0] if data else ''
            bullet_items = [item for item in data if item.startswith('_•_') or (len(data) > 1 and data.index(item) > 0 and not first_item.startswith('_•_'))]
            
            if first_item and not first_item.startswith('_•_'):
                html += f"        <p>{make_links_clickable(first_item)}</p>\n"
            
            if bullet_items:
                html += "        <ul>\n"
                for item in bullet_items:
                    clean_item = item.replace('_•_', '').strip()
                    if clean_item:
                        html += f"          <li>{make_links_clickable(clean_item)}</li>\n"
                html += "        </ul>\n"
    
    else:
        if title:
            html += f"        <h3>{make_links_clickable(title)}</h3>\n"
        if data:
            html += "        <ul>\n"
            for item in data:
                html += f"          <li>{make_links_clickable(item)}</li>\n"
            html += "        </ul>\n"
    
    html += "      </div>\n"
    return html

@app.get("/resume/{resume_id}", response_class=HTMLResponse)
async def view_sharable_resume(resume_id: str):
    """Public endpoint to view resume via sharable link"""
    try:
        print(f"👁️ Viewing sharable resume: {resume_id}")
        
        resume = await resumes_collection.find_one({"resume_id": resume_id})
        
        if not resume:
            return HTMLResponse(
                content="""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Resume Not Found</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0;
                        }
                        .container {
                            background: white;
                            padding: 40px;
                            border-radius: 20px;
                            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        }
                        h1 { color: #e74c3c; margin-bottom: 20px; }
                        p { color: #666; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>📄 Resume Not Found</h1>
                        <p>This resume link may be invalid or expired.</p>
                    </div>
                </body>
                </html>
                """,
                status_code=404
            )
        
        await resumes_collection.update_one(
            {"resume_id": resume_id},
            {"$inc": {"view_count": 1}}
        )
        
        print(f"✅ Serving resume (view #{resume.get('view_count', 0) + 1})")
        
        profile_data = resume.get('profile_data', {})
        metadata = resume.get('metadata', {})
        
        clean_html = generate_html_from_profile_data(profile_data, metadata)
        
        return HTMLResponse(content=clean_html)
        
    except Exception as e:
        print(f"❌ View resume error: {e}")
        traceback.print_exc()
        return HTMLResponse(
            content="""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    h1 { color: #e74c3c; margin-bottom: 20px; }
                    p { color: #666; font-size: 18px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>❌ Error Loading Resume</h1>
                    <p>An error occurred while loading this resume.</p>
                </div>
            </body>
            </html>
            """,
            status_code=500
        )

def generate_basic_html_resume(profile_data: dict) -> str:
    """Generate basic HTML resume as fallback"""
    sections = clean_empty_sections(profile_data.get('sections', []))
    
    html_parts = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="UTF-8">',
        '<style>',
        'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }',
        '.section { margin: 20px 0; }',
        '.section-title { font-size: 20px; font-weight: bold; border-bottom: 2px solid #3498db; margin-bottom: 10px; padding-bottom: 5px; }',
        '.subsection { margin: 15px 0 15px 20px; }',
        '.subsection-title { font-weight: bold; margin-bottom: 5px; }',
        '.data-item { margin: 5px 0; }',
        'a { color: #3b82f6; text-decoration: underline; }',
        '</style>',
        '</head>',
        '<body>'
    ]
    
    for section in sections:
        html_parts.append(f'<div class="section">')
        html_parts.append(f'<div class="section-title">{section.get("section_name", "")}</div>')
        
        for subsection in section.get('subsections', []):
            html_parts.append(f'<div class="subsection">')
            if subsection.get('title'):
                html_parts.append(f'<div class="subsection-title">{make_links_clickable(subsection["title"])}</div>')
            
            for item in subsection.get('data', []):
                if item and item.strip():
                    html_parts.append(f'<div class="data-item">• {make_links_clickable(item)}</div>')
            
            html_parts.append('</div>')
        
        html_parts.append('</div>')
    
    html_parts.extend(['</body>', '</html>'])
    
    return '\n'.join(html_parts)

@app.get("/api/user-profile/{email}")
async def get_user_profile(email: str):
    try:
        profile = await profiles_collection.find_one({"email": email})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile["_id"] = str(profile["_id"])
        
        # Clean empty sections before returning
        if 'resumeData' in profile and 'sections' in profile['resumeData']:
            profile['resumeData']['sections'] = clean_empty_sections(profile['resumeData']['sections'])
        
        return profile
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Get profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/user-profile/{email}")
async def update_user_profile(email: str, request: Dict[str, Any]):
    try:
        resume_data = request.get('resumeData')
        if not resume_data:
            raise HTTPException(status_code=400, detail="Resume data is required")
        
        # Clean empty sections before updating
        resume_data['sections'] = clean_empty_sections(resume_data.get('sections', []))
        
        result = await profiles_collection.update_one(
            {"email": email},
            {"$set": {"resumeData": resume_data, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        await generate_user_resume(email)
        
        return {"message": "Profile updated successfully", "email": email}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Update profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/user-profile/{email}/roles")
async def update_user_roles(email: str, request: Dict[str, Any]):
    try:
        selected_roles = request.get('selectedRoles')
        if not selected_roles:
            raise HTTPException(status_code=400, detail="Selected roles are required")
        
        result = await profiles_collection.update_one(
            {"email": email},
            {"$set": {"selectedRoles": selected_roles, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        await generate_user_resume(email)
        
        return {"message": "Roles updated successfully", "email": email}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Update roles error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/regenerate-resume/{email}")
async def regenerate_resume(email: str):
    """Manually regenerate resume for a user"""
    try:
        print(f"🔄 Manual resume regeneration for: {email}")
        
        profile = await profiles_collection.find_one({"email": email})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        resume_info = await generate_user_resume(email)
        
        if not resume_info:
            raise HTTPException(status_code=500, detail="Failed to regenerate resume")
        
        print(f"✅ Resume regenerated successfully for: {email}")
        return {
            "message": "Resume regenerated successfully",
            "resume_info": resume_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Regenerate resume error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-jd")
async def process_jd(file: UploadFile = File(...), jd_text: str = Form(...)):
    # Read PDF text
    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    jd_text = " ".join([page.extract_text() for page in pdf_reader.pages])

    jd_skills = extract_skills_from_jd(jd_text)

    # get skills from database and call compare function
    candidate_skills = ["Python", "AWS", "Machine Learning"]  # Placeholder for actual skills from DB
    matched, missed, match_score = compare_skills(jd_skills, candidate_skills)

    # Sample return
    return {
        "matched_skills": matched,
        "missed_skills": missed,
        "match_score": f"{match_score}%"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")