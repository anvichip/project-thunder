# auth.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import httpx
import os
from database import get_database

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 7 days

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:3000/auth/linkedin/callback")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Password Hashing
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

# JWT Token Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
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
    
    db = get_database()
    user = db.users.find_one({"email": email})
    
    if user is None:
        raise credentials_exception
    
    return user

# Google OAuth
async def verify_google_token(token: str) -> Optional[dict]:
    """Verify Google OAuth token"""
    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        return idinfo
    except Exception as e:
        print(f"Google token verification failed: {e}")
        return None

# LinkedIn OAuth
async def get_linkedin_access_token(code: str) -> Optional[str]:
    """Exchange LinkedIn authorization code for access token"""
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "clientId": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
        "redirect_uri": LINKEDIN_REDIRECT_URI
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            
            if response.status_code == 200:
                token_data = response.json()
                return token_data.get("access_token")
            else:
                print(f"LinkedIn token error: {response.text}")
                return None
    except Exception as e:
        print(f"LinkedIn token exchange failed: {e}")
        return None

async def get_linkedin_user_info(access_token: str) -> Optional[dict]:
    """Get LinkedIn user information"""
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        async with httpx.AsyncClient() as client:
            # Get basic profile
            profile_response = await client.get(
                "https://api.linkedin.com/v2/me",
                headers=headers
            )
            
            # Get email
            email_response = await client.get(
                "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                headers=headers
            )
            
            if profile_response.status_code == 200 and email_response.status_code == 200:
                profile_data = profile_response.json()
                email_data = email_response.json()
                
                # Extract email
                email = email_data["elements"][0]["handle~"]["emailAddress"]
                
                # Extract name
                first_name = profile_data.get("localizedFirstName", "")
                last_name = profile_data.get("localizedLastName", "")
                name = f"{first_name} {last_name}".strip()
                
                return {
                    "id": profile_data.get("id"),
                    "email": email,
                    "name": name,
                    "picture": None  # LinkedIn profile pictures require additional API calls
                }
            else:
                print(f"LinkedIn API error: {profile_response.text}")
                return None
    except Exception as e:
        print(f"LinkedIn user info failed: {e}")
        return None