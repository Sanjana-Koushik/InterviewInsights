from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, List
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# ---- MODELS ----

class Round(BaseModel):
    round_number: int
    round_type: str
    duration: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    user_id: Optional[str] = None
    company: str
    role: str
    interview_type: Optional[str] = None
    experience_level: Optional[str] = None
    month_year: Optional[str] = None
    prep_details: Optional[str] = None
    outcome: str
    tips: Optional[str] = None
    is_anonymous: Optional[bool] = False
    rounds: Optional[List[Round]] = []

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    interview_type: Optional[str] = None
    experience_level: Optional[str] = None
    month_year: Optional[str] = None
    prep_details: Optional[str] = None
    outcome: Optional[str] = None
    tips: Optional[str] = None
    is_anonymous: Optional[bool] = None
    rounds: Optional[List[Round]] = []

class Comment(BaseModel):
    experience_id: str
    user_id: Optional[str] = None
    parent_comment_id: Optional[str] = None
    body: str

class UserProfile(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None
    college: Optional[str] = None
    graduation_year: Optional[int] = None
    branch: Optional[str] = None
    job_seeker_type: Optional[str] = None

class UserProfileUpdate(BaseModel):
    college: Optional[str] = None
    graduation_year: Optional[int] = None
    branch: Optional[str] = None
    job_seeker_type: Optional[str] = None

# ---- ROUTES ----

@app.get("/experiences")
def get_experiences():
    response = supabase.table("experiences").select("*").execute()
    return response.data

@app.get("/experiences/{experience_id}")
def get_experience(experience_id: str):
    experience = supabase.table("experiences").select("*").eq("id", experience_id).execute()
    rounds = supabase.table("rounds").select("*").eq("experience_id", experience_id).execute()
    if not experience.data:
        raise HTTPException(status_code=404, detail="Experience not found")
    result = experience.data[0]
    result["rounds"] = rounds.data
    return result

@app.post("/experiences")
def create_experience(experience: Experience):
    exp_data = experience.dict(exclude={"rounds"})
    exp_response = supabase.table("experiences").insert(exp_data).execute()
    if not exp_response.data:
        raise HTTPException(status_code=400, detail="Failed to create experience")
    new_experience_id = exp_response.data[0]["id"]
    if experience.rounds:
        for r in experience.rounds:
            round_data = r.dict()
            round_data["experience_id"] = new_experience_id
            supabase.table("rounds").insert(round_data).execute()
    return {"message": "Experience created successfully", "id": new_experience_id}

@app.put("/experiences/{experience_id}")
def update_experience(experience_id: str, experience: ExperienceUpdate):
    exp_data = {k: v for k, v in experience.dict(exclude={"rounds"}).items() if v is not None}
    supabase.table("experiences").update(exp_data).eq("id", experience_id).execute()
    if experience.rounds is not None:
        supabase.table("rounds").delete().eq("experience_id", experience_id).execute()
        for r in experience.rounds:
            round_data = r.dict()
            round_data["experience_id"] = experience_id
            supabase.table("rounds").insert(round_data).execute()
    return {"message": "Experience updated successfully"}

@app.delete("/experiences/{experience_id}")
def delete_experience(experience_id: str):
    supabase.table("rounds").delete().eq("experience_id", experience_id).execute()
    supabase.table("comments").delete().eq("experience_id", experience_id).execute()
    supabase.table("experiences").delete().eq("id", experience_id).execute()
    return {"message": "Experience deleted successfully"}

@app.get("/experiences/{experience_id}/comments")
def get_comments(experience_id: str):
    response = supabase.table("comments").select("*").eq("experience_id", experience_id).execute()
    return response.data

@app.post("/comments")
def create_comment(comment: Comment):
    response = supabase.table("comments").insert(comment.dict()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to post comment")
    return {"message": "Comment posted successfully", "id": response.data[0]["id"]}

@app.get("/roadmap")
def get_roadmap(company: str, role: str):
    experiences = supabase.table("experiences")\
        .select("*")\
        .eq("company", company)\
        .eq("role", role)\
        .execute()
    if not experiences.data:
        return {"experiences": [], "stats": {}}
    total = len(experiences.data)
    selected = len([e for e in experiences.data if e["outcome"] == "Selected"])
    exp_ids = [e["id"] for e in experiences.data]
    all_rounds = []
    for exp_id in exp_ids:
        rounds = supabase.table("rounds")\
            .select("*")\
            .eq("experience_id", exp_id)\
            .execute()
        all_rounds.extend(rounds.data)
    round_type_counts = {}
    for r in all_rounds:
        rt = r["round_type"]
        round_type_counts[rt] = round_type_counts.get(rt, 0) + 1
    round_percentages = {
        rt: round((count / total) * 100)
        for rt, count in round_type_counts.items()
    }
    return {
        "experiences": experiences.data,
        "stats": {
            "total": total,
            "selected": selected,
            "selection_rate": round((selected / total) * 100),
            "round_percentages": round_percentages
        }
    }

# ---- PROFILE ROUTES ----

@app.get("/profile/{user_id}")
def get_profile(user_id: str):
    profile = supabase.table("users").select("*").eq("id", user_id).execute()
    experiences = supabase.table("experiences").select("*").eq("user_id", user_id).execute()
    if not profile.data:
        return {"profile": None, "experiences": experiences.data}
    return {"profile": profile.data[0], "experiences": experiences.data}

@app.post("/profile")
def create_or_update_profile(user: UserProfile):
    existing = supabase.table("users").select("*").eq("id", user.id).execute()
    if existing.data:
        supabase.table("users").update(user.dict()).eq("id", user.id).execute()
    else:
        supabase.table("users").insert(user.dict()).execute()
    return {"message": "Profile saved successfully"}

@app.put("/profile/{user_id}")
def update_profile(user_id: str, profile: UserProfileUpdate):
    update_data = {k: v for k, v in profile.dict().items() if v is not None}
    supabase.table("users").update(update_data).eq("id", user_id).execute()
    return {"message": "Profile updated successfully"}