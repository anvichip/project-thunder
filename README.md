# Resume Unlocked - Complete Job Application Platform

A comprehensive platform for managing resumes, job applications, and career opportunities with AI-powered features.

## Features

### Authentication
- Email/Password authentication
- Google OAuth integration
- Persistent sessions with JWT tokens
- Auth method tracking (Email/Google) displayed during onboarding

### Onboarding
- Resume upload and parsing (PDF)
- Manual profile creation
- Data verification step
- Role selection (8+ career paths)
- User info & logout button on all onboarding pages

### Dashboard
- Profile management
- Skills, experience, and education tracking
- Role preferences management
- **Resume Template Generator** - Upload templates and auto-fill with profile data
- **LaTeX Resume Editor** - Overleaf-style editor with live preview

### Resume Features
1. **Template Upload & Generation**
   - Upload PDF/DOCX templates
   - Auto-fill with profile data
   - Generate PDF or DOCX output
   - Save templates for reuse
   - Preview before download

2. **LaTeX Resume Editor**
   - Live LaTeX editor
   - Real-time PDF compilation
   - Formatting toolbar (Bold, Italic, Underline)
   - Structure helpers (Section, Subsection, Bullets)
   - Font size control
   - Auto-compile mode
   - Save/load drafts
   - Download compiled PDF

## Prerequisites

### System Requirements
- Node.js 18+ and npm/yarn
- Python 3.9+
- MongoDB 5.0+
- TeX Live or MiKTeX (for LaTeX compilation)
- LibreOffice (optional, for DOCX to PDF conversion)

### Installing LaTeX (Required for Resume Editor)

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install texlive-full
```

**macOS:**
```bash
brew install --cask mactex
```

**Windows:**
- Download and install MiKTeX from https://miktex.org/download

### Installing LibreOffice (Optional, for Template Processing)

**Ubuntu/Debian:**
```bash
sudo apt-get install libreoffice
```

**macOS:**
```bash
brew install --cask libreoffice
```

**Windows:**
- Download from https://www.libreoffice.org/download/download/

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd project-thunder
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `backend/.env`:
```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=resumeunlocked_db

# Security
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Server
PORT=8000
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
# or
yarn install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 5. Firebase Setup (for Google Auth)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Google Authentication
4. Get your Firebase config
5. Update `frontend/src/firebase.js` with your config

## Running the Application

### Start MongoDB
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

### Start Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```
Backend runs on `http://localhost:8000`

### Start Frontend
```bash
cd frontend
npm run dev
# or
yarn dev
```
Frontend runs on `http://localhost:5173`

## Project Structure

```
project-thunder/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AuthHeader.jsx          # NEW: Auth info header
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── VerificationPage.jsx
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── Congratulations.jsx
│   │   │   ├── MainDashboard.jsx
│   │   │   ├── ResumeTemplateUpload.jsx  # NEW: Template generator
│   │   │   ├── ResumeEditor.jsx          # NEW: LaTeX editor
│   │   │   ├── EditProfileModal.jsx
│   │   │   └── EditRolesModal.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── firebase.js
│   └── package.json
│
├── backend/
│   ├── main.py                    # Updated with new endpoints
│   ├── auth.py
│   ├── database.py
│   ├── resume_parser.py
│   ├── latex_compiler.py         # NEW: LaTeX to PDF compiler
│   ├── template_processor.py     # NEW: Template processing
│   ├── requirements.txt
│   ├── .env
│   └── directories/
│       ├── uploads/              # Resume uploads
│       ├── temp/                 # Temporary files
│       └── output/               # Generated PDFs
│
└── README.md
```

## Key Features Explained

### 1. Authentication with Method Tracking
When users log in via Google or Email, their auth method is tracked and displayed throughout the onboarding process with appropriate icons:
- Google: Shows Google logo
- Email: Shows mail icon

### 2. Onboarding with Logout
All onboarding pages (Resume Upload, Verification, Role Selection) now include:
- `AuthHeader` component showing user info and auth method
- Logout button to switch accounts

### 3. Resume Template Generator
Users can:
- Upload resume templates (PDF/DOCX)
- System auto-fills with profile data using placeholders like `{{NAME}}`, `{{EMAIL}}`, etc.
- Generate output in PDF or DOCX format
- Save templates for future use
- Preview before downloading

### 4. LaTeX Resume Editor
A full-featured editor similar to Overleaf:
- Real-time LaTeX editing with syntax highlighting
- Formatting toolbar (Bold, Italic, Underline)
- Structure helpers (Sections, Subsections, Bullet points)
- Live PDF preview
- Auto-compile mode (2-second delay)
- Save/load drafts
- Font size adjustment
- Download compiled PDF

## Resume Template Format

Create templates with placeholders:

```latex
% LaTeX Template Example
\documentclass{article}
\begin{document}

\section*{{{NAME}}}
Email: {{EMAIL}}\\
Phone: {{PHONE}}\\
LinkedIn: {{LINKEDIN}}\\
GitHub: {{GITHUB}}

\section*{Skills}
{{SKILLS}}

\section*{Experience}
{{EXPERIENCE}}

\section*{Education}
{{EDUCATION}}

\end{document}
```

Or in DOCX, simply use placeholders like `{{NAME}}` where you want data inserted.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register with email
- `POST /api/auth/login` - Login with email
- `POST /api/auth/firebase` - Google OAuth

### Profile
- `POST /api/save-user-profile` - Save profile
- `GET /api/user-profile/:email` - Get profile
- `PUT /api/user-profile/:email` - Update profile
- `PUT /api/user-profile/:email/roles` - Update roles

### Resume Processing
- `POST /api/upload-resume` - Upload and parse PDF resume

### Template Generation (NEW)
- `POST /api/generate-resume` - Generate from template
- `GET /api/templates/:email` - Get saved templates
- `POST /api/preview-resume` - Preview before download

### LaTeX Editor (NEW)
- `POST /api/compile-latex` - Compile LaTeX to PDF
- `GET /api/default-latex-template` - Get starter template
- `POST /api/save-draft` - Save draft
- `GET /api/drafts/:email` - Get user drafts
- `GET /api/draft/:id` - Get specific draft
- `GET /api/pdf/:filename` - Serve compiled PDF

## Troubleshooting

### LaTeX Compilation Issues
```bash
# Check if pdflatex is installed
pdflatex --version

# If not installed, install TeX Live
sudo apt-get install texlive-full  # Ubuntu/Debian
brew install --cask mactex         # macOS
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows (then kill PID)
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=resumeunlocked_db
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
PORT=8000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id
```

## Usage Guide

### Creating a Resume with Templates
1. Go to Dashboard → Resume Templates
2. Upload your template (PDF/DOCX with placeholders)
3. Click "Generate PDF" or "Generate DOCX"
4. Download your filled resume
5. Template is saved for future use

### Using the LaTeX Editor
1. Go to Dashboard → Resume Editor
2. Write or edit LaTeX code
3. Click "Compile" or enable "Auto-compile"
4. View live PDF preview
5. Save drafts for later editing
6. Download final PDF

## Security Notes

- Never commit `.env` files
- Change SECRET_KEY in production
- Use HTTPS in production
- Set up proper CORS policies
- Use environment-specific Firebase configs

## Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables
2. Install TeX Live in build phase
3. Deploy with `python main.py`

### Frontend (Vercel/Netlify)
1. Set environment variables
2. Build command: `npm run build`
3. Output directory: `dist`

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update MONGODB_URL
