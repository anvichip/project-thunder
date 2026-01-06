# CareerHub - Project Structure & Setup Guide

## 📁 Project Structure

```
careerhub/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── VerificationPage.jsx
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── Congratulations.jsx
│   │   │   └── MainDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # FastAPI Backend
│   ├── main.py
│   ├── resume_parser.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

## 🚀 Setup Instructions

### Backend Setup (FastAPI)

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Setup MongoDB:**
   - Install MongoDB locally OR use MongoDB Atlas (cloud)
   - For local: Download from https://www.mongodb.com/try/download/community
   - For Atlas: Create free cluster at https://www.mongodb.com/cloud/atlas

3. **Configure environment variables:**
```bash
# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URL
MONGODB_URL=mongodb://localhost:27017
# OR for Atlas:
# MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerhub
```

4. **Run the backend:**
```bash
python main.py
# OR
uvicorn main:app --reload
```

Backend will run on: http://localhost:8000

### Frontend Setup (React + Vite)

1. **Install Node.js dependencies:**
```bash
cd frontend
npm install
```

2. **Configure Tailwind CSS:**

Create `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. **Setup Vite config:**

Create `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

4. **Update index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Run the frontend:**
```bash
npm run dev
```

Frontend will run on: http://localhost:3000

## 🔧 MongoDB Collections

The application uses two main collections:

### 1. users
```javascript
{
  "_id": ObjectId,
  "email": String,
  "password": String (optional, for email/password auth),
  "method": String, // "Email/Password", "Google OAuth", "LinkedIn OAuth"
  "username": String (optional),
  "name": String (optional),
  "googleId": String (optional),
  "linkedInId": String (optional),
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### 2. profiles
```javascript
{
  "_id": ObjectId,
  "email": String,
  "profileData": {
    "fullName": String,
    "email": String,
    "phone": String,
    "linkedin": String,
    "github": String,
    "skills": String,
    "experience": String,
    "education": String
  },
  "selectedRoles": Array[String],
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

## 🎯 Features

### Completed Features:
- ✅ Multi-method authentication (Email/Password, Google OAuth mock, LinkedIn OAuth mock)
- ✅ Resume upload and parsing (PDF)
- ✅ Manual data entry
- ✅ Verification page for extracted data
- ✅ Role selection (8 different tech roles)
- ✅ Congratulations page with auto-redirect
- ✅ Main dashboard with navigation
- ✅ Profile display
- ✅ MongoDB integration

### To Be Implemented:
- 🔄 Real OAuth integration (Google, LinkedIn)
- 🔄 Job matching algorithm
- 🔄 Application tracking
- 🔄 Analytics dashboard
- 🔄 Settings management
- 🔄 Email notifications
- 🔄 Advanced resume parsing (using AI/ML)

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Resume & Profile
- `POST /api/upload-resume` - Upload and parse resume
- `POST /api/save-user-profile` - Save complete profile with roles
- `GET /api/user-profile/{email}` - Get user profile
- `DELETE /api/user-profile/{email}` - Delete user profile

## 🔐 Security Notes

For production deployment:
1. Add password hashing (bcrypt)
2. Implement JWT authentication
3. Add rate limiting
4. Enable HTTPS
5. Implement real OAuth flows
6. Add input validation and sanitization
7. Use environment variables for secrets
8. Add CSRF protection

## 🧪 Testing

To test the resume parser:
1. Create a sample PDF resume
2. Upload it through the UI
3. Check the verification page for extracted data
4. The parser looks for common sections: name, email, phone, LinkedIn, GitHub, skills, experience, education

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request