# InterviewInsights

A platform for sharing and discovering real interview experiences.

## Features
- 🎯 Browse experiences by company, role and level
- 🗺️ Interview roadmaps with round patterns  
- 💬 Q&A with the author
- 🔐 Google authentication
- 📝 Share, edit and delete your own experiences

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)

## Project Structure
interviewinsights/
├── backend/    # FastAPI backend
└── frontend/   # React frontend

## Setup

### Backend
cd backend
pip install fastapi uvicorn supabase python-dotenv
python -m uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm start