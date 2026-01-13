# main.py - FIXED VERSION with Better Error Handling
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

# Import resume parser
from parser.resume_parser_llm import main as parse_resume_llm
from parser.loaders import load_resume

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

    @validator('subsections')
    def validate_subsections(cls, v):
        if not v:
            raise ValueError('Each section must have at least one subsection')
        for subsection in v:
            if not subsection.data:
                raise ValueError('Each subsection must have at least one data item')
        return v

class ParsedResumeData(BaseModel):
    sections: List[ResumeSection]

    @validator('sections')
    def validate_sections(cls, v):
        if not v:
            raise ValueError('Resume must have at least one section')
        return v

class SaveProfileRequest(BaseModel):
    email: EmailStr
    resumeData: Dict[str, Any]
    selectedRoles: List[str]

    @validator('resumeData')
    def validate_resume_data(cls, v):
        if 'sections' not in v:
            raise ValueError('resumeData must contain sections')
        if not isinstance(v['sections'], list):
            raise ValueError('sections must be a list')
        if len(v['sections']) == 0:
            raise ValueError('sections cannot be empty')
        return v

    @validator('selectedRoles')
    def validate_roles(cls, v):
        if not v:
            raise ValueError('At least one role must be selected')
        return v

# Helper Functions
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

# Startup/Shutdown
@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("✅ Connected to MongoDB successfully")
        
        await users_collection.create_index("email", unique=True)
        await profiles_collection.create_index("email", unique=True)
        print("✅ Database indexes created")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        traceback.print_exc()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Root & Health
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

# Authentication Endpoints
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

# Resume Upload with Dynamic Parsing
@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...), userId: str = ""):
    temp_path = None
    parsed_json_path = None
    
    try:
        print(f"📤 Resume upload started for user: {userId}")
        print(f"📄 File: {file.filename}, Content-Type: {file.content_type}")
        
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
            raise HTTPException(
                status_code=400, 
                detail="Only PDF and DOCX files are allowed"
            )
        
        # Save uploaded file temporarily
        temp_path = os.path.join(TEMP_DIR, f"temp_{userId}_{file.filename}")
        print(f"💾 Saving to: {temp_path}")
        
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        file_size = os.path.getsize(temp_path)
        print(f"📊 File size: {file_size / 1024:.2f} KB")
        
        # Parse resume using LLM
        print(f"🤖 Starting LLM parsing...")
        parsed_json_path = "resume_parsed.json"
        
        try:
            parse_resume_llm(temp_path)
            print(f"✅ LLM parsing completed")
        except Exception as parse_error:
            print(f"❌ LLM parsing failed: {parse_error}")
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Resume parsing failed: {str(parse_error)}"
            )
        
        # Read and validate parsed JSON
        if not os.path.exists(parsed_json_path):
            raise HTTPException(
                status_code=500,
                detail="Parsing completed but output file not found"
            )
        
        with open(parsed_json_path, 'r', encoding='utf-8') as f:
            extracted_data = json.load(f)
        
        print(f"📋 Parsed data structure: {json.dumps(extracted_data, indent=2)[:500]}...")
        
        # Validate structure
        if 'sections' not in extracted_data:
            raise HTTPException(
                status_code=500,
                detail="Invalid parsing result: missing 'sections' key"
            )
        
        if not isinstance(extracted_data['sections'], list):
            raise HTTPException(
                status_code=500,
                detail="Invalid parsing result: 'sections' must be a list"
            )
        
        if len(extracted_data['sections']) == 0:
            raise HTTPException(
                status_code=500,
                detail="No sections found in resume. Please ensure your resume has clear section headings."
            )
        
        # Validate each section
        for idx, section in enumerate(extracted_data['sections']):
            if 'section_name' not in section:
                raise HTTPException(
                    status_code=500,
                    detail=f"Section {idx} missing 'section_name'"
                )
            if 'subsections' not in section:
                raise HTTPException(
                    status_code=500,
                    detail=f"Section '{section.get('section_name')}' missing 'subsections'"
                )
            if not isinstance(section['subsections'], list):
                raise HTTPException(
                    status_code=500,
                    detail=f"Section '{section.get('section_name')}' subsections must be a list"
                )
            
            # Validate subsections
            for sub_idx, subsection in enumerate(section['subsections']):
                if 'title' not in subsection:
                    subsection['title'] = ''
                if 'data' not in subsection:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Subsection {sub_idx} in '{section.get('section_name')}' missing 'data'"
                    )
                if not isinstance(subsection['data'], list):
                    raise HTTPException(
                        status_code=500,
                        detail=f"Subsection data must be a list in '{section.get('section_name')}'"
                    )
        
        print(f"✅ Resume parsed successfully with {len(extracted_data['sections'])} sections")
        
        return {
            "message": "Resume parsed successfully",
            "extractedData": extracted_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Resume upload error: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )
    finally:
        # Clean up temp files
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

# Save Profile with Validation
@app.post("/api/save-user-profile")
async def save_user_profile(request: SaveProfileRequest):
    try:
        print(f"💾 Saving profile for: {request.email}")
        print(f"📊 Resume sections: {len(request.resumeData.get('sections', []))}")
        print(f"👔 Selected roles: {len(request.selectedRoles)}")
        
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
        
        # Mark profile as completed
        await users_collection.update_one(
            {"email": request.email},
            {"$set": {"profile_completed": True}}
        )
        
        print(f"✅ {message}: {request.email}")
        return {"message": message, "email": request.email}
        
    except Exception as e:
        print(f"❌ Save profile error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Get User Profile
@app.get("/api/user-profile/{email}")
async def get_user_profile(email: str):
    try:
        print(f"📖 Fetching profile for: {email}")
        
        profile = await profiles_collection.find_one({"email": email})
        
        if not profile:
            print(f"❌ Profile not found: {email}")
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile["_id"] = str(profile["_id"])
        print(f"✅ Profile found: {email}")
        return profile
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Get profile error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Update Profile
@app.put("/api/user-profile/{email}")
async def update_user_profile(email: str, request: Dict[str, Any]):
    try:
        print(f"🔄 Updating profile for: {email}")
        
        resume_data = request.get('resumeData')
        if not resume_data:
            raise HTTPException(status_code=400, detail="Resume data is required")
        
        result = await profiles_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "resumeData": resume_data,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        print(f"✅ Profile updated successfully: {email}")
        return {"message": "Profile updated successfully", "email": email}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Update profile error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Update Roles
@app.put("/api/user-profile/{email}/roles")
async def update_user_roles(email: str, request: Dict[str, Any]):
    try:
        print(f"🔄 Updating roles for: {email}")
        
        selected_roles = request.get('selectedRoles')
        if not selected_roles:
            raise HTTPException(status_code=400, detail="Selected roles are required")
        
        result = await profiles_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "selectedRoles": selected_roles,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        print(f"✅ Roles updated successfully: {email}")
        return {"message": "Roles updated successfully", "email": email}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Update roles error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")