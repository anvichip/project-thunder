from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import httpx
import os
from dotenv import load_dotenv
import PyPDF2
import re

# Import resume parser functions
from resume_parser import parse_resume

load_dotenv()

app = FastAPI(title="CareerHub API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
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

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 7 days

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Startup and Shutdown Events
@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        # Create indexes
        await users_collection.create_index("email", unique=True)
        await profiles_collection.create_index("email", unique=True)
        print("✅ Database indexes created")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    print("MongoDB connection closed")

# Pydantic Models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class FirebaseAuthRequest(BaseModel):
    uid: str
    email: EmailStr
    name: str
    photoURL: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ProfileData(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None

class SaveProfileRequest(BaseModel):
    email: EmailStr
    profileData: ProfileData
    selectedRoles: List[str]

class UpdateProfileRequest(BaseModel):
    profileData: ProfileData

class UpdateRolesRequest(BaseModel):
    selectedRoles: List[str]

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

# API Endpoints
@app.get("/")
async def root():
    return {"message": "CareerHub API is running"}

@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check username
    existing_username = await users_collection.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user_doc = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hashed_password,
        "auth_provider": "email",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user_doc["_id"]),
            "username": user_doc["username"],
            "email": user_doc["email"],
            "auth_provider": user_doc["auth_provider"]
        }
    }

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    # Find user
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user.get("username", ""),
            "email": user["email"],
            "name": user.get("name", ""),
            "auth_provider": user.get("auth_provider", "email"),
            "picture": user.get("picture")
        }
    }

@app.post("/api/auth/firebase", response_model=Token)
async def firebase_auth(auth_data: FirebaseAuthRequest):
    """
    Handle Firebase (Google) authentication
    Creates or retrieves user and returns JWT token
    """
    email = auth_data.email
    
    # Find or create user
    user = await users_collection.find_one({"email": email})
    
    if not user:
        # Create new user from Firebase data
        user_doc = {
            "email": email,
            "username": auth_data.name,
            "name": auth_data.name,
            "firebase_uid": auth_data.uid,
            "picture": auth_data.photoURL,
            "auth_provider": "google",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc
        print(f"✅ Created new user via Google: {email}")
    else:
        # Update existing user with latest info
        await users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "firebase_uid": auth_data.uid,
                    "picture": auth_data.photoURL,
                    "name": auth_data.name,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        print(f"✅ Updated existing user via Google: {email}")
    
    # Create JWT access token
    access_token = create_access_token(data={"sub": email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user.get("username", user.get("name", "")),
            "email": user["email"],
            "name": user.get("name", ""),
            "auth_provider": user.get("auth_provider", "google"),
            "picture": user.get("picture")
        }
    }

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...), userId: str = ""):
    temp_path = ""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse resume
        extracted_data = parse_resume(temp_path)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return {
            "message": "Resume parsed successfully",
            "extractedData": extracted_data
        }
    except Exception as e:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save-user-profile")
async def save_user_profile(request: SaveProfileRequest):
    try:
        existing_profile = await profiles_collection.find_one({"email": request.email})
        
        profile_data = {
            "email": request.email,
            "profileData": request.profileData.dict(),
            "selectedRoles": request.selectedRoles,
            "updatedAt": datetime.utcnow()
        }
        
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
        
        return {"message": message, "email": request.email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user-profile/{email}")
async def get_user_profile(email: str):
    try:
        profile = await profiles_collection.find_one({"email": email})
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile["_id"] = str(profile["_id"])
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/user-profile/{email}")
async def update_profile(email: str, request: UpdateProfileRequest):
    try:
        profile = await profiles_collection.find_one({"email": email})
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        await profiles_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "profileData": request.profileData.dict(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        return {"message": "Profile updated successfully", "email": email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/user-profile/{email}/roles")
async def update_roles(email: str, request: UpdateRolesRequest):
    try:
        profile = await profiles_collection.find_one({"email": email})
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        await profiles_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "selectedRoles": request.selectedRoles,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        return {"message": "Roles updated successfully", "email": email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/user-profile/{email}")
async def delete_profile(email: str):
    try:
        result = await profiles_collection.delete_one({"email": email})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {"message": "Profile deleted successfully", "email": email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)